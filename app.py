from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_filter1_result', methods=['POST'])
def get_filter1_result():
    user_complaint = request.json['message']
    filter1_result = filter1(user_complaint)
    return jsonify(filter1_result)

@app.route('/get_filter2_result', methods=['POST'])
def get_filter2_result():
    user_complaint = request.json['message']
    filter2_result = filter2(user_complaint)
    return jsonify(filter2_result)

@app.route('/get_filter3_result', methods=['POST'])
def get_filter3_result():
    user_complaint = request.json['message']
    filter3_result = filter3(user_complaint)
    return jsonify(filter3_result)

# Filter 1 함수
def filter1(user_complaint):
    status = "yes"  # 예시 결과값
    category = "환경"
    return {"status": status, "category": category}

# Filter 2 함수
def filter2(user_complaint):
    status = "yes"  # 예시 결과값
    return {"status": status}

# Filter 3 함수
def filter3(user_complaint):
    status = "yes"  # 예시 결과값
    filtered_message = "부적절한 내용이 수정되었습니다."  # 예시 결과값
    return {"status": status, "filteredMessage": filtered_message}

if __name__ == '__main__':
    app.run(debug=True)