# 📱 생활형 계산기 웹 서비스 기능 명세서 (For AI Agent)

## 1. 퍼센트(%) 계산기 (다목적 비율 계산)
*   **Description**: 일상적인 비율, 증감률 등을 계산합니다.
*   **Inputs**:
    *   `baseValue` (Number): 기준값
    *   `percent` (Number): 퍼센트 값
*   **Logic (3가지 모드 지원)**:
    1.  비율 계산: `baseValue`의 `percent`%는 얼마인가? → `result = baseValue * (percent / 100)`
    2.  일부 값 비율: `percent`가 `baseValue`의 몇 %인가? → `result = (percent / baseValue) * 100`
    3.  증감률 계산: `baseValue`에서 `percent`로 변하면 몇 % 증감했는가? → `result = ((percent - baseValue) / baseValue) * 100`
*   **Outputs**: 소수점 둘째 자리까지 반올림된 `Number`
*   **Edge Cases**: `baseValue`가 0일 경우 나누기 오류(Division by Zero) 방지를 위해 `0` 또는 예외 메시지 반환.

## 2. 비만도 (BMI) 계산기
*   **Description**: 신장과 체중을 기반으로 체질량지수를 계산합니다.
*   **Inputs**:
    *   `height` (Number): 키 (단위: cm)
    *   `weight` (Number): 몸무게 (단위: kg)
*   **Logic**:
    *   `heightInMeters = height / 100`
    *   `bmi = weight / (heightInMeters ** 2)`
*   **Outputs**:
    *   `bmiScore` (Number): 소수점 첫째 자리 반올림
    *   `category` (String): 저체중(BMI < 18.5), 정상(18.5 ≤ BMI < 23), 과체중(23 ≤ BMI < 25), 비만(25 ≤ BMI)
*   **Edge Cases**: 신장이나 체중이 0 이하의 음수 값으로 입력될 경우 계산 차단.

## 3. 할인율 및 최종 결제액 계산기
*   **Description**: 상품의 원래 가격과 할인율(또는 할인가)을 입력하여 최종 금액을 도출합니다.
*   **Inputs**:
    *   `originalPrice` (Number): 원가
    *   `discountRate` (Number): 할인율(%)
*   **Logic**:
    *   `discountAmount = originalPrice * (discountRate / 100)`
    *   `finalPrice = originalPrice - discountAmount`
*   **Outputs**: `discountAmount` (할인된 금액), `finalPrice` (최종 결제 금액)
*   **Edge Cases**: `discountRate`가 100을 초과하거나 0 미만일 경우 입력 제한.

## 4. 더치페이 (N빵) 계산기
*   **Description**: 총 결제 금액을 참석 인원수로 공평하게 나눕니다.
*   **Inputs**:
    *   `totalAmount` (Number): 총 결제 금액
    *   `peopleCount` (Number): 참석 인원수
*   **Logic**:
    *   `amountPerPerson = totalAmount / peopleCount`
    *   한국 화폐 단위 특성상 1원/10원 단위 절사 옵션 추가 (예: `Math.ceil(amountPerPerson / 10) * 10`)
*   **Outputs**: 인당 지불해야 할 금액 `amountPerPerson`
*   **Edge Cases**: `peopleCount`가 1 이하일 경우 `totalAmount` 그대로 반환.

## 5. 디데이 (D-Day) 및 날짜 계산기
*   **Description**: 특정 목표일(예: 시험, 과제 제출일, 기념일)까지 남은 날짜를 정확히 계산합니다.
*   **Inputs**:
    *   `targetDate` (Date String: YYYY-MM-DD): 목표 날짜
    *   `currentDate` (Date String: YYYY-MM-DD): 기준 날짜 (Default: Today)
*   **Logic**:
    *   `diffInMs = new Date(targetDate).getTime() - new Date(currentDate).getTime()`
    *   `diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))`
*   **Outputs**:
    *   `diffInDays > 0` 이면 `D-diffInDays`
    *   `diffInDays === 0` 이면 `D-Day`
    *   `diffInDays < 0` 이면 `D+Math.abs(diffInDays)`

## 6. 대학 학점 (GPA) 계산기
*   **Description**: 학기별 수강 과목의 학점(Credits)과 성적(Grade)을 바탕으로 평점 평균을 풉니다.
*   **Inputs**:
    *   `courses` (Array of Objects): `[{ credits: Number, grade: String }]`
*   **Logic**:
    *   Grade Point Mapping: A+ (4.5), A0 (4.0), B+ (3.5), B0 (3.0), C+ (2.5), C0 (2.0), D+ (1.5), D0 (1.0), F (0.0). (Pass/Fail 과목은 제외)
    *   `totalGradePoints = Σ (credits * Grade Point)`
    *   `totalCredits = Σ credits`
    *   `gpa = totalGradePoints / totalCredits`
*   **Outputs**: 평점 평균 `gpa` (소수점 둘째 자리 반올림)

## 7. 대출 원리금 균등상환 계산기
*   **Description**: 원금과 이자를 합하여 매월 동일한 금액을 상환하는 방식을 계산합니다.
*   **Inputs**:
    *   `principal` (Number): 대출 원금 (P)
    *   `annualInterestRate` (Number): 연 이자율 (%)
    *   `months` (Number): 상환 기간 (개월 수, n)
*   **Logic**:
    *   월 이자율: `r = (annualInterestRate / 100) / 12`
    *   월 상환액 (PMT) 방정식: `PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)`
    *   총 상환액: `PMT * n`
    *   총 이자액: `(PMT * n) - P`
*   **Outputs**: `monthlyPayment` (월 상환액), `totalInterest` (총 이자액)

## 8. 부동산 면적 변환기 (평수 ↔ 제곱미터)
*   **Description**: 주거 공간이나 토지의 면적 단위를 상호 변환합니다.
*   **Inputs**:
    *   `areaValue` (Number): 면적 값
    *   `convertType` (String): `"sqmToPyung"` 또는 `"pyungToSqm"`
*   **Logic**:
    *   1평 = 3.305785 m^2
    *   `sqmToPyung`: `areaValue / 3.305785`
    *   `pyungToSqm`: `areaValue * 3.305785`
*   **Outputs**: 변환된 면적 값 (소수점 둘째 자리 반올림)

## 9. 유류비 (자동차 주유비) 계산기
*   **Description**: 이동 거리와 차량 연비를 기반으로 예상 유류비를 산출합니다.
*   **Inputs**:
    *   `distance` (Number): 이동할 총 거리 (km)
    *   `fuelEfficiency` (Number): 차량 연비 (km/L)
    *   `fuelPrice` (Number): 현재 유가 (원/L)
*   **Logic**:
    *   `requiredFuel = distance / fuelEfficiency`
    *   `totalCost = requiredFuel * fuelPrice`
*   **Outputs**: 예상 총 유류비 `totalCost` (원 단위 반올림)
*   **Edge Cases**: `fuelEfficiency`가 0으로 입력될 경우 계산 불가 처리.

## 10. 주휴수당 및 알바 급여 계산기
*   **Description**: 시급과 주간 근무 시간을 기반으로 주휴수당을 포함한 예상 주급을 풉니다.
*   **Inputs**:
    *   `hourlyWage` (Number): 시급
    *   `weeklyHours` (Number): 1주 총 근무 시간
*   **Logic**:
    *   기본 주급: `basePay = hourlyWage * weeklyHours`
    *   주휴수당 산정 방정식: `weeklyHours`가 15시간 이상일 경우 발생.
    *   `holidayAllowance = (Math.min(weeklyHours, 40) / 40) * 8 * hourlyWage`
    *   `totalPay = basePay + holidayAllowance`
*   **Outputs**: `basePay` (기본급), `holidayAllowance` (주휴수당), `totalPay` (총 주급)
