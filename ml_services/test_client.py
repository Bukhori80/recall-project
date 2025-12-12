"""
Test Client untuk Telco Recommendation API (Updated)
Cocok untuk Backend V3 (inference_telco.py)
"""

import requests
import json
import time
from typing import Dict, List

# Configuration
API_URL = "http://localhost:5000"

# Test Cases (Data Input disesuaikan dengan kebutuhan Model V2)
test_customers = [
    {
        "name": "Heavy Video Streamer",
        "data": {
            "avg_data_usage_gb": 6.5,
            "pct_video_usage": 0.75,
            "avg_call_duration": 8,
            "sms_freq": 5,
            "monthly_spend": 95000,
            "topup_freq": 3,
            "travel_score": 0.2,
            "complaint_count": 0,
            "plan_type": "Postpaid",
            "device_brand": "Samsung"
        },
        "expected_hint": "Streaming"
    },
    {
        "name": "Frequent Traveler",
        "data": {
            "avg_data_usage_gb": 4.0,
            "pct_video_usage": 0.3,
            "avg_call_duration": 12,
            "sms_freq": 10,
            "monthly_spend": 88000,
            "topup_freq": 4,
            "travel_score": 0.65,
            "complaint_count": 0,
            "plan_type": "Postpaid",
            "device_brand": "Apple"
        },
        "expected_hint": "Roaming"
    },
    {
        "name": "Budget Prepaid User",
        "data": {
            "avg_data_usage_gb": 2.5,
            "pct_video_usage": 0.2,
            "avg_call_duration": 15,
            "sms_freq": 8,
            "monthly_spend": 58000,
            "topup_freq": 6,
            "travel_score": 0.1,
            "complaint_count": 0,
            "plan_type": "Prepaid",
            "device_brand": "Realme"
        },
        "expected_hint": "Top-up / Data Booster"
    },
    {
        "name": "Unhappy Customer (Churn Risk)",
        "data": {
            "avg_data_usage_gb": 3.5,
            "pct_video_usage": 0.4,
            "avg_call_duration": 10,
            "sms_freq": 5,
            "monthly_spend": 75000,
            "topup_freq": 3,
            "travel_score": 0.3,
            "complaint_count": 2, # Ada komplain
            "plan_type": "Postpaid",
            "device_brand": "Xiaomi"
        },
        "expected_hint": "Retention"
    },
    {
        "name": "Voice-Heavy User",
        "data": {
            "avg_data_usage_gb": 2.0,
            "pct_video_usage": 0.15,
            "avg_call_duration": 30, # Telpon lama
            "sms_freq": 15,
            "monthly_spend": 72000,
            "topup_freq": 4,
            "travel_score": 0.2,
            "complaint_count": 0,
            "plan_type": "Postpaid",
            "device_brand": "Oppo"
        },
        "expected_hint": "Voice Bundle"
    }
]

def print_header(text: str):
    print("\n" + "="*70)
    print(f"  {text}")
    print("="*70)

def print_result(test_name: str, result: Dict, response_time: float, expected: str):
    """Print test result formatted"""
    print(f"\n🧪 Test: {test_name}")
    print(f"⏱️  Response Time: {response_time*1000:.2f}ms")
    
    if result.get('status') == 'success':
        # MENYESUAIKAN RESPONSE KEY DARI APP.PY
        offer_name = result.get('offer_name', 'Unknown')
        confidence = result.get('confidence', 0.0)
        
        print(f"✅ AI Recommendation: {offer_name}")
        print(f"📊 Confidence: {confidence:.2%}")
        print(f"🎯 Expected Hint: {expected}")
        
        if confidence >= 0.70:
            print(f"   ✅ Confidence OK (≥70%)")
        else:
            print(f"   ⚠️  Confidence Low")
    else:
        print(f"❌ Error: {result.get('message', 'Unknown error')}")

def test_health_check():
    """Cek apakah server jalan dengan mengirim dummy request"""
    print_header("SERVER CHECK")
    try:
        # Kita pakai endpoint /recommend dengan data kosong untuk cek koneksi
        # Server harusnya merespon (meski mungkin default value) atau error 500 handling
        dummy_data = {"monthly_spend": 10000} 
        response = requests.post(f"{API_URL}/recommend", json=dummy_data, timeout=5)
        
        if response.status_code == 200:
            print("✅ API is responding (200 OK)")
            return True
        else:
            print(f"❌ API Error: Status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Is 'python app.py' running?")
        print(f"   Target: {API_URL}")
        return False
    except Exception as e:
        print(f"❌ Check error: {str(e)}")
        return False

def test_single_predictions():
    """Test individual predictions"""
    print_header("RECOMENDATION TESTS")
    
    results = []
    
    for test_case in test_customers:
        try:
            start_time = time.time()
            # UPDATE ENDPOINT KE /recommend
            response = requests.post(
                f"{API_URL}/recommend",
                json=test_case['data'],
                timeout=10
            )
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                result = response.json()
                print_result(test_case['name'], result, response_time, test_case['expected_hint'])
                results.append(True)
            else:
                print(f"\n❌ Test Failed: {test_case['name']}")
                print(f"   Status: {response.status_code}")
                print(f"   Response: {response.text}")
                results.append(False)
                
        except Exception as e:
            print(f"\n❌ Exception: {test_case['name']}")
            print(f"   Error: {str(e)}")
            results.append(False)
            
    return results

def test_performance_stress():
    """Performance stress test"""
    print_header("PERFORMANCE STRESS TEST (20 Requests)")
    
    times = []
    test_data = test_customers[0]['data']
    
    for i in range(20):
        try:
            start = time.time()
            requests.post(f"{API_URL}/recommend", json=test_data, timeout=5)
            elapsed = time.time() - start
            times.append(elapsed)
            print(".", end="", flush=True)
        except Exception as e:
            print("x", end="", flush=True)
    
    print("\n")
    if times:
        avg_time = sum(times)/len(times)*1000
        print(f"📊 Stats:")
        print(f"   Avg time: {avg_time:.2f}ms")
        print(f"   Min time: {min(times)*1000:.2f}ms")
        print(f"   Max time: {max(times)*1000:.2f}ms")
        
        if avg_time < 200:
            print("✅ Performance: Excellent (<200ms)")
        else:
            print("⚠️ Performance: Acceptable (Review preprocessing speed)")
    else:
        print("❌ All stress tests failed")

def main():
    print("\n" + "="*70)
    print("  TELCO RECOMMENDATION API V3 - TEST CLIENT")
    print("="*70)
    
    if not test_health_check():
        return
    
    results = test_single_predictions()
    
    # Skip batch test karena app.py V3 tidak implementasi batch endpoint
    
    test_performance_stress()
    
    print_header("SUMMARY")
    success_count = sum(results)
    print(f"✅ Tests Passed: {success_count}/{len(results)}")
    
    if success_count == len(results):
        print("🚀 SYSTEM READY FOR INTEGRATION!")
    else:
        print("⚠️  Some tests failed. Check logs above.")

if __name__ == "__main__":
    main()