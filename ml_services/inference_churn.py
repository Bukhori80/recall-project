import joblib
import pandas as pd
import numpy as np
import os

class ChurnPredictor:
    def __init__(self, model_dir='.'):
        self.model_path = os.path.join(model_dir, 'rf_churn_risk_model.pkl')
        self.scaler_path = os.path.join(model_dir, 'scaler.pkl')
        self.encoders_path = os.path.join(model_dir, 'label_encoders.pkl')
        
        self.model = None
        self.scaler = None
        self.encoders = None
        
        # Urutan Fitur WAJIB SAMA dengan saat training (Cek README)
        self.feature_order = [
            'plan_type', 
            'device_brand', 
            'pct_video_usage', 
            'monthly_spend', 
            'travel_score', 
            'complaint_count'
        ]
        
        self._load_artifacts()

    def _load_artifacts(self):
        try:
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
            self.encoders = joblib.load(self.encoders_path)
            print("✅ Churn Model & Artifacts loaded successfully!")
        except Exception as e:
            print(f"❌ Failed to load Churn artifacts: {e}")

    def preprocess(self, data):
        """
        Mengubah data JSON menjadi Array yang siap diprediksi.
        Melakukan Encoding dan Scaling.
        """
        # 1. Buat DataFrame
        df = pd.DataFrame([data])
        
        # 2. Pastikan kolom numerik aman
        numeric_cols = ['pct_video_usage', 'monthly_spend', 'travel_score', 'complaint_count']
        for col in numeric_cols:
            df[col] = pd.to_numeric(df.get(col, 0), errors='coerce').fillna(0)

        # 3. Encoding Kategorikal (Plan & Device)
        # Menggunakan LabelEncoder yang sudah disimpan
        cat_cols = ['plan_type', 'device_brand']
        
        for col in cat_cols:
            raw_val = str(df.get(col, pd.Series(['Unknown'])).iloc[0])
            encoder = self.encoders.get(col)
            
            if encoder:
                try:
                    # Cek apakah nilai ada di dalam encoder
                    if raw_val in encoder.classes_:
                        encoded_val = encoder.transform([raw_val])[0]
                    else:
                        # Fallback jika device baru/tidak dikenal (misal pakai index 0)
                        encoded_val = 0
                except:
                    encoded_val = 0
            else:
                encoded_val = 0
            
            # Ganti nilai di dataframe
            df[col] = encoded_val

        # 4. Reorder Kolom (PENTING!) & Scaling
        # Pastikan urutan kolom sesuai self.feature_order sebelum masuk scaler
        df_ordered = df[self.feature_order]
        
        # Scaling (Normalisasi Angka)
        X_scaled = self.scaler.transform(df_ordered.values)
        
        return X_scaled

    def predict(self, data):
        if not self.model:
            return {"status": "error", "message": "Churn Model not loaded"}

        try:
            # Preprocess Data
            X = self.preprocess(data)
            
            # Predict Probability (Ambil probabilitas kelas 1 / Churn)
            churn_prob = self.model.predict_proba(X)[0][1]
            
            # Tentukan Kategori Risiko
            risk_category = "Low"
            if churn_prob > 0.7:
                risk_category = "High"
            elif churn_prob > 0.4:
                risk_category = "Medium"

            return {
                "status": "success",
                "risk_score": float(churn_prob), # 0.0 - 1.0
                "risk_category": risk_category,
                "prediction": 1 if churn_prob > 0.5 else 0
            }

        except Exception as e:
            print(f"❌ Error predicting churn: {e}")
            return {"status": "error", "message": str(e)}