import joblib
import pandas as pd
import numpy as np
import os
import traceback

class TelcoRecommender:
    def __init__(self, model_path='telco_pipeline_model.pkl'):
        self.model_path = model_path
        self.model = None
        self.le_plan = None
        self.le_device = None
        self.le_target = None
        self.features = []
        self._load_model()

    def _load_model(self):
        """Memuat model dan komponen pendukung dari file .pkl"""
        if not os.path.exists(self.model_path):
            print(f"❌ Error: File {self.model_path} tidak ditemukan!")
            return

        try:
            artifacts = joblib.load(self.model_path)
            
            # Ekstrak komponen
            # Model sekarang adalah PIPELINE lengkap
            self.model = artifacts.get('model') or artifacts.get('pipeline')
            
            # Encoder helper (tetap dipakai untuk encode teks awal)
            self.le_plan = artifacts.get('le_plan')
            self.le_device = artifacts.get('le_device')
            self.le_target = artifacts.get('le_target')
            
            # Daftar fitur yang diharapkan Pipeline
            self.features = artifacts.get('features')

            print("✅ Model Pipeline loaded successfully!")
            if self.features:
                print(f"   Expecting columns: {self.features}")
            
        except Exception as e:
            print(f"❌ Failed to load artifacts: {str(e)}")

    def preprocess(self, user_data):
        """
        Mengubah data JSON menjadi DataFrame yang SIAP untuk Pipeline.
        """
        # 1. Buat DataFrame awal
        df = pd.DataFrame([user_data])
        
        # Konversi ke numerik untuk kolom angka
        numeric_cols = ['avg_data_usage_gb', 'pct_video_usage', 'avg_call_duration', 
                        'sms_freq', 'monthly_spend', 'topup_freq', 'travel_score', 'complaint_count']
        
        for col in numeric_cols:
            if col not in df.columns:
                df[col] = 0
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

        # ---------------------------------------------------------
        # 2. FEATURE ENGINEERING (Wajib Ada)
        # ---------------------------------------------------------
        
        # Fitur Tambahan (Sesuai model baru)
        # Hindari pembagian dengan nol dengan menambahkan +1.0 atau +0.1
        df['video_data_intensity'] = df['avg_data_usage_gb'] * df['pct_video_usage']
        df['spend_per_call_unit'] = df['monthly_spend'] / (df['avg_call_duration'] + 1.0)
        
        # ---------------------------------------------------------
        # 3. ENCODING MANUAL
        # (Karena Pipeline mengharapkan input 'plan_type' & 'device_brand' sebagai angka)
        # ---------------------------------------------------------
        
        # Plan Type
        plan_val = str(df.get('plan_type', pd.Series(['Prepaid'])).iloc[0])
        try:
            if self.le_plan and plan_val in self.le_plan.classes_:
                # Encode jadi angka (misal: Prepaid -> 0)
                df['plan_type'] = self.le_plan.transform([plan_val])[0]
            else:
                df['plan_type'] = 0 
        except:
            df['plan_type'] = 0

        # Device Brand
        device_val = str(df.get('device_brand', pd.Series(['Other'])).iloc[0])
        try:
            if self.le_device and device_val in self.le_device.classes_:
                df['device_brand'] = self.le_device.transform([device_val])[0]
            else:
                df['device_brand'] = 0
        except:
            df['device_brand'] = 0
            
        # ---------------------------------------------------------
        # 4. ORDERING (Sangat Penting)
        # ---------------------------------------------------------
        if self.features:
            # Pastikan semua kolom yang diminta model ada di DataFrame
            for feat in self.features:
                if feat not in df.columns:
                    # print(f"⚠️ Adding missing feature: {feat}")
                    df[feat] = 0
            
            # Ambil hanya kolom yang dibutuhkan, sesuai urutan
            df_final = df[self.features]
            
            # --- PERBAIKAN UTAMA DI SINI ---
            # JANGAN gunakan .values atau .to_numpy()
            # Kembalikan DataFrame utuh agar Pipeline bisa baca nama kolomnya
            return df_final
            
        return df

    def predict(self, user_data):
        if not self.model:
            return {"status": "error", "message": "Model not loaded"}

        try:
            # Preprocess (Sekarang mengembalikan DataFrame)
            X_df = self.preprocess(user_data)
            
            # Predict
            # Pipeline otomatis melakukan Scaling di dalam sini
            pred_idx = self.model.predict(X_df)[0]
            
            # Probability
            confidence = 0.0
            if hasattr(self.model, "predict_proba"):
                confidence = float(np.max(self.model.predict_proba(X_df)[0]))

            # Decode Label (Angka -> Nama Paket)
            pred_label = str(pred_idx)
            if self.le_target:
                pred_label = self.le_target.inverse_transform([pred_idx])[0]

            return {
                "status": "success",
                "recommendation": pred_label,
                "confidence_score": f"{confidence:.2%}",
                "confidence_raw": confidence
            }

        except Exception as e:
            print("\n❌ CRITICAL ERROR saat prediksi:")
            print(traceback.format_exc())
            return {"status": "error", "message": str(e)}