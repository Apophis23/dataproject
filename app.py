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
    category_result = "농업_축산/기타/문의(질의)"
    if category_result:
        return {"status": "no", "category": category_result}
    else:
        return {"status": "no"}

# Filter 2 함수
def filter2(user_complaint):
    state=0
    if state == 0:
        return {"status": "no"}
    else:
        return {"status": "yes"}

# Filter 3 함수
def filter3(user_complaint):
    revised_text = "안녕하세요, 예천군 유기동물보호소를 운영하고 계신가요?"
    return {"status": "yes", "filteredMessage": revised_text}

if __name__ == '__main__':
    app.run(debug=True)