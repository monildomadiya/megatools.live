export const calculateTool = (slug: string, inputs: any) => {
  switch (slug) {
    case 'bmi-calculator': {
      const weight = parseFloat(inputs.weight);
      const height = parseFloat(inputs.height) / 100; // cm to m
      if (!weight || !height) return null;
      const bmi = weight / (height * height);
      let category = '';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal weight';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obese';
      return [bmi.toFixed(2), category];
    }

    case 'bmr-calculator':
    case 'brm-calculator': {
      const { age, gender, weight, height } = inputs;
      if (!age || !weight || !height) return null;
      // Mifflin-St Jeor Equation
      let bmr = 10 * weight + 6.25 * height - 5 * age;
      bmr = gender === 'male' ? bmr + 5 : bmr - 161;
      return [bmr.toFixed(0) + ' kcal/day', (bmr * 1.2).toFixed(0) + ' kcal/day (Sedentary)'];
    }

    case 'tdee-calculator': {
      const { age, gender, weight, height, activity } = inputs;
      if (!age || !weight || !height || !activity) return null;
      let bmr = 10 * weight + 6.25 * height - 5 * age;
      bmr = gender === 'male' ? bmr + 5 : bmr - 161;
      const tdee = bmr * parseFloat(activity);
      return [tdee.toFixed(0) + ' kcal/day'];
    }

    case 'loan-emi-calculator': {
      const { amount, rate, tenure } = inputs;
      if (!amount || !rate || !tenure) return null;
      const r = rate / (12 * 100);
      const n = tenure * 12;
      const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - amount;
      return [emi.toFixed(2), totalInterest.toFixed(2), totalPayment.toFixed(2)];
    }

    case 'compound-interest-calculator': {
      const { principal, rate, years, frequency } = inputs;
      if (!principal || !rate || !years || !frequency) return null;
      const P = parseFloat(principal);
      const r = parseFloat(rate) / 100;
      const t = parseFloat(years);
      const n = parseFloat(frequency);
      const A = P * Math.pow(1 + r / n, n * t);
      return [A.toFixed(2), (A - P).toFixed(2)];
    }

    case 'percentage-calculator': {
      const { num1, num2 } = inputs;
      if (!num1 || !num2) return null;
      const result = (num1 / 100) * num2;
      return [result.toFixed(2)];
    }

    case 'word-counter': {
      const text = inputs.text || '';
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      const sentences = text.split(/[.!?]+/).filter(Boolean).length;
      const paragraphs = text.split(/\n+/).filter(Boolean).length;
      return [words, chars, sentences, paragraphs];
    }

    case 'length-converter': {
      const { value, from, to } = inputs;
      if (value === undefined || !from || !to) return null;
      const factors: any = { m: 1, km: 1000, cm: 0.01, mi: 1609.34, ft: 0.3048, in: 0.0254 };
      const valInMeters = value * factors[from];
      const result = valInMeters / factors[to];
      return [result.toFixed(4)];
    }
    
    case 'tip-calculator': {
      const { bill, tipPercent, people } = inputs;
      if (!bill || !tipPercent || !people) return null;
      const totalTip = (bill * tipPercent) / 100;
      const totalBill = parseFloat(bill) + totalTip;
      return [totalTip.toFixed(2), totalBill.toFixed(2), (totalBill / people).toFixed(2)];
    }

    case 'password-generator': {
      const length = parseInt(inputs.length) || 12;
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
      let retVal = "";
      for (let i = 0; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return [retVal];
    }

    case 'average-calculator': {
      const nums = inputs.numbers?.split(',').map((n: string) => parseFloat(n.trim())).filter((n: any) => !isNaN(n));
      if (!nums || nums.length === 0) return null;
      const sum = nums.reduce((a: number, b: number) => a + b, 0);
      const mean = sum / nums.length;
      const sorted = [...nums].sort((a, b) => a - b);
      const median = sorted.length % 2 === 0 ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2 : sorted[Math.floor(sorted.length/2)];
      return [mean.toFixed(2), median.toFixed(2), 'N/A', (sorted[sorted.length-1] - sorted[0]).toFixed(2)];
    }

    case 'salary-calculator': {
      const { salary, hours } = inputs;
      if (!salary) return null;
      const annual = parseFloat(salary);
      const weeklyHours = parseFloat(hours) || 40;
      const monthly = annual / 12;
      const weekly = annual / 52;
      const daily = weekly / 5;
      const hourly = weekly / weeklyHours;
      return [monthly.toFixed(2), weekly.toFixed(2), daily.toFixed(2), hourly.toFixed(2)];
    }

    case 'weight-converter': {
      const { value, from, to } = inputs;
      if (value === undefined || !from || !to) return null;
      const factors: any = { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 };
      const valInKg = value * factors[from];
      const result = valInKg / factors[to];
      return [result.toFixed(4)];
    }

    case 'temperature-converter': {
      const { value, from, to } = inputs;
      if (value === undefined || !from || !to) return null;
      let valInC = value;
      if (from === 'f') valInC = (value - 32) * 5/9;
      else if (from === 'k') valInC = value - 273.15;
      
      let result = valInC;
      if (to === 'f') result = (valInC * 9/5) + 32;
      else if (to === 'k') result = valInC + 273.15;
      return [result.toFixed(2)];
    }

    case 'age-calculator': {
      if (!inputs.dob) return null;
      const birthDate = new Date(inputs.dob);
      const today = new Date();
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      let days = today.getDate() - birthDate.getDate();
      if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
      }
      return [`${years} Years`, `${months} Months`, `${days} Days`];
    }

    case 'ratio-calculator': {
      const { a, b } = inputs;
      if (!a || !b) return null;
      const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
      const common = gcd(a, b);
      return [`${a/common} : ${b/common}`];
    }

    case 'character-counter': {
      const text = inputs.text || '';
      return [text.length, text.replace(/\s/g, '').length];
    }

    case 'slug-generator': {
      const text = inputs.text || '';
      return [text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')];
    }

    case 'ideal-weight-calculator': {
      const { gender, height } = inputs;
      if (!height) return null;
      const hInches = height / 2.54;
      const base = gender === 'male' ? 50 : 45.5;
      const result = base + 2.3 * (hInches - 60);
      return [result.toFixed(1) + ' kg'];
    }

    case 'sip-calculator': {
      const { monthly, rate, years } = inputs;
      if (!monthly || !rate || !years) return null;
      const P = parseFloat(monthly);
      const i = (rate / 100) / 12;
      const n = years * 12;
      const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const invested = P * n;
      return [invested.toFixed(0), (totalValue - invested).toFixed(0), totalValue.toFixed(0)];
    }

    default:
      return null;
  }
};
