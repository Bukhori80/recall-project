from flask import Flask, request, jsonify
from inference_telco import TelcoRecommender # Model Rekomendasi
from inference_churn import ChurnPredictor   # <--- IMPORT MODEL CHURN BARU

app = Flask(__name__)

# Inisialisasi Model (Sekali saja saat start)
recommender = TelcoRecommender()
churn_predictor = ChurnPredictor()

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    
    # Jalankan prediksi lewat class inference
    result = recommender.predict(data)
    
    if result.get("status") == "error":
        return jsonify(result), 500
        
    print(f"🤖 Output: {result}")
    
    # Format return disesuaikan agar Node.js mudah membacanya
    return jsonify({
        "status": "success",
        "offer_name": result['recommendation'],
        "confidence": result['confidence_raw'],
        "offer_type": "AUTO_MAPPED"
    })

# New Endpoint untuk Churn Prediction
@app.route('/predict', methods=['POST'])
def predict_churn():
    try:
        data = request.json
        print(f"\n⚠️ Request Churn Prediction received for: {data.get('username', 'Unknown')}")
        
        # Panggil logika prediksi real
        result = churn_predictor.predict(data)
        
        if result.get("status") == "error":
             return jsonify(result), 500
        print("✅ Churn Prediction successful. Results:", result)
        print(f"📊 Churn Score: {result['risk_score']:.4f} ({result['risk_category']})")
        
        return jsonify({
            "status": "success",
            "prediction": result['prediction'],
            "risk_score": result['risk_score'],
            "risk_category": result['risk_category'],
            "result": result
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    print("🚀 API Server Running on port 5000...")
    app.run(port=5000, debug=True)