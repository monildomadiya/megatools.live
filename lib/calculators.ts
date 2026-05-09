export const calculateTool = (slug: string, inputs: any): any[] | null => {
  switch (slug) {
    case 'bmi-calculator': {
      const weight = parseFloat(inputs.weight);
      const height = parseFloat(inputs.height) / 100;
      if (!weight || !height) return null;
      const bmi = weight / (height * height);
      let category = '';
      if (bmi < 18.5) category = '⚠️ Underweight';
      else if (bmi < 25) category = '✅ Normal weight';
      else if (bmi < 30) category = '⚠️ Overweight';
      else category = '🔴 Obese';
      return [bmi.toFixed(2), category];
    }
    case 'bmr-calculator':
    case 'brm-calculator': {
      const { age, gender, weight, height } = inputs;
      if (!age || !weight || !height) return null;
      let bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseFloat(age);
      bmr = gender === 'male' ? bmr + 5 : bmr - 161;
      return [bmr.toFixed(0) + ' kcal/day', (bmr * 1.2).toFixed(0) + ' kcal (Sedentary)'];
    }
    case 'tdee-calculator': {
      const { age, gender, weight, height, activity } = inputs;
      if (!age || !weight || !height || !activity) return null;
      let bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseFloat(age);
      bmr = gender === 'male' ? bmr + 5 : bmr - 161;
      const tdee = bmr * parseFloat(activity);
      return [tdee.toFixed(0) + ' kcal/day', (tdee - 500).toFixed(0) + ' kcal (Weight Loss)', (tdee + 500).toFixed(0) + ' kcal (Weight Gain)'];
    }
    case 'body-fat-calculator': {
      const { gender, height, neck, waist, hip } = inputs;
      if (!height || !neck || !waist) return null;
      const h = parseFloat(height), n = parseFloat(neck), w = parseFloat(waist), hi = parseFloat(hip || 0);
      let bf = 0;
      if (gender === 'male') {
        bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
      } else {
        bf = 163.205 * Math.log10(w + hi - n) - 97.684 * Math.log10(h) - 78.387;
      }
      let cat = bf < 6 ? 'Essential Fat' : bf < 14 ? 'Athletes' : bf < 18 ? 'Fitness' : bf < 25 ? 'Acceptable' : 'Obese';
      return [bf.toFixed(1) + '%', cat];
    }
    case 'ideal-weight-calculator': {
      const { gender, height } = inputs;
      if (!height) return null;
      const hInches = parseFloat(height) / 2.54;
      const base = gender === 'male' ? 50 : 45.5;
      const devine = base + 2.3 * (hInches - 60);
      const miller = (gender === 'male' ? 56.2 : 53.1) + 1.41 * (hInches - 60);
      const robinson = (gender === 'male' ? 52 : 49) + 1.9 * (hInches - 60);
      return [devine.toFixed(1) + ' kg (Devine)', miller.toFixed(1) + ' kg (Miller)', robinson.toFixed(1) + ' kg (Robinson)'];
    }
    case 'calorie-calculator': {
      const { age, gender, weight, height, activity } = inputs;
      if (!age || !weight || !height || !activity) return null;
      let bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseFloat(age);
      bmr = gender === 'male' ? bmr + 5 : bmr - 161;
      const maintain = bmr * parseFloat(activity);
      return [maintain.toFixed(0) + ' kcal', (maintain - 500).toFixed(0) + ' kcal', (maintain + 500).toFixed(0) + ' kcal'];
    }
    case 'loan-emi-calculator': {
      const { amount, rate, tenure } = inputs;
      if (!amount || !rate || !tenure) return null;
      const r = parseFloat(rate) / (12 * 100);
      const n = parseFloat(tenure) * 12;
      const emi = (parseFloat(amount) * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - parseFloat(amount);
      return ['$' + emi.toFixed(2), '$' + totalInterest.toFixed(2), '$' + totalPayment.toFixed(2)];
    }
    case 'compound-interest-calculator': {
      const { principal, rate, years, frequency } = inputs;
      if (!principal || !rate || !years || !frequency) return null;
      const P = parseFloat(principal), r = parseFloat(rate) / 100, t = parseFloat(years), n = parseFloat(frequency);
      const A = P * Math.pow(1 + r / n, n * t);
      return ['$' + A.toFixed(2), '$' + (A - P).toFixed(2)];
    }
    case 'simple-interest-calculator': {
      const { principal, rate, years } = inputs;
      if (!principal || !rate || !years) return null;
      const P = parseFloat(principal), r = parseFloat(rate) / 100, t = parseFloat(years);
      const interest = P * r * t;
      return ['$' + interest.toFixed(2), '$' + (P + interest).toFixed(2)];
    }
    case 'mortgage-calculator': {
      const { price, downpayment, rate, years } = inputs;
      if (!price || !rate || !years) return null;
      const principal = parseFloat(price) - parseFloat(downpayment || 0);
      const r = parseFloat(rate) / (12 * 100);
      const n = parseFloat(years) * 12;
      const monthly = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPaid = monthly * n;
      return ['$' + monthly.toFixed(2), '$' + totalPaid.toFixed(2), '$' + (totalPaid - principal).toFixed(2)];
    }
    case 'sip-calculator': {
      const { monthly, rate, years } = inputs;
      if (!monthly || !rate || !years) return null;
      const P = parseFloat(monthly), i = parseFloat(rate) / 100 / 12, n = parseFloat(years) * 12;
      const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const invested = P * n;
      return ['$' + invested.toFixed(0), '$' + (totalValue - invested).toFixed(0), '$' + totalValue.toFixed(0)];
    }
    case 'salary-calculator': {
      const { salary, hours } = inputs;
      if (!salary) return null;
      const annual = parseFloat(salary), weeklyHours = parseFloat(hours) || 40;
      return ['$' + (annual / 12).toFixed(2), '$' + (annual / 52).toFixed(2), '$' + (annual / 260).toFixed(2), '$' + (annual / 52 / weeklyHours).toFixed(2)];
    }
    case 'tax-calculator': {
      const { income, filingStatus } = inputs;
      if (!income) return null;
      const inc = parseFloat(income);
      let tax = 0;
      const brackets = filingStatus === 'married' 
        ? [[23200,0.10],[94300,0.12],[201050,0.22],[383900,0.24],[487450,0.32],[731200,0.35],[Infinity,0.37]]
        : [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]];
      let prev = 0;
      for (const [limit, rate] of brackets) {
        if (inc <= prev) break;
        tax += (Math.min(inc, limit as number) - prev) * (rate as number);
        prev = limit as number;
      }
      const effective = (tax / inc * 100).toFixed(2);
      return ['$' + tax.toFixed(2), effective + '%', '$' + (inc - tax).toFixed(2)];
    }
    case 'percentage-calculator': {
      const { num1, num2 } = inputs;
      if (!num1 || !num2) return null;
      const result = (parseFloat(num1) / 100) * parseFloat(num2);
      const increase = ((parseFloat(num2) - parseFloat(num1)) / parseFloat(num1) * 100);
      return [result.toFixed(2), increase.toFixed(2) + '%'];
    }
    case 'average-calculator': {
      const nums = inputs.numbers?.split(',').map((n: string) => parseFloat(n.trim())).filter((n: number) => !isNaN(n));
      if (!nums || nums.length === 0) return null;
      const sum = nums.reduce((a: number, b: number) => a + b, 0);
      const mean = sum / nums.length;
      const sorted = [...nums].sort((a: number, b: number) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
      const range = sorted[sorted.length - 1] - sorted[0];
      return [mean.toFixed(4), median.toFixed(4), sum.toFixed(4), range.toFixed(4)];
    }
    case 'ratio-calculator': {
      const { a, b } = inputs;
      if (!a || !b) return null;
      const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
      const av = parseFloat(a), bv = parseFloat(b);
      const common = gcd(av, bv);
      return [`${av/common} : ${bv/common}`, ((av/bv)*100).toFixed(2) + '%'];
    }
    case 'length-converter': {
      const { value, from, to } = inputs;
      if (value === '' || value === undefined || !from || !to) return null;
      const factors: Record<string,number> = { m:1, km:1000, cm:0.01, mm:0.001, mi:1609.344, ft:0.3048, in:0.0254, yd:0.9144 };
      const result = parseFloat(value) * factors[from] / factors[to];
      return [result.toFixed(6).replace(/\.?0+$/, ''), from.toUpperCase() + ' to ' + to.toUpperCase()];
    }
    case 'weight-converter': {
      const { value, from, to } = inputs;
      if (value === '' || value === undefined || !from || !to) return null;
      const factors: Record<string,number> = { kg:1, g:0.001, lb:0.453592, oz:0.0283495, t:1000, st:6.35029 };
      const result = parseFloat(value) * factors[from] / factors[to];
      return [result.toFixed(6).replace(/\.?0+$/, ''), from.toUpperCase() + ' to ' + to.toUpperCase()];
    }
    case 'temperature-converter': {
      const { value, from, to } = inputs;
      if (value === '' || value === undefined || !from || !to) return null;
      const v = parseFloat(value);
      let c = from === 'f' ? (v-32)*5/9 : from === 'k' ? v-273.15 : v;
      let result = to === 'f' ? c*9/5+32 : to === 'k' ? c+273.15 : c;
      return [result.toFixed(4).replace(/\.?0+$/, '') + '°'];
    }
    case 'area-converter': {
      const { value, from, to } = inputs;
      if (value === '' || value === undefined || !from || !to) return null;
      const factors: Record<string,number> = { m2:1, km2:1e6, cm2:0.0001, ha:10000, acre:4046.86, ft2:0.092903, in2:0.00064516 };
      const result = parseFloat(value) * factors[from] / factors[to];
      return [result.toFixed(6).replace(/\.?0+$/, '')];
    }
    case 'speed-converter': {
      const { value, from, to } = inputs;
      if (value === '' || value === undefined || !from || !to) return null;
      const factors: Record<string,number> = { ms:1, kph:1/3.6, mph:0.44704, kt:0.514444, fps:0.3048 };
      const result = parseFloat(value) * factors[from] / factors[to];
      return [result.toFixed(6).replace(/\.?0+$/, '')];
    }
    case 'age-calculator': {
      if (!inputs.dob) return null;
      const birth = new Date(inputs.dob), today = new Date();
      let years = today.getFullYear() - birth.getFullYear();
      let months = today.getMonth() - birth.getMonth();
      let days = today.getDate() - birth.getDate();
      if (days < 0) { months--; days += 30; }
      if (months < 0) { years--; months += 12; }
      const totalDays = Math.floor((today.getTime() - birth.getTime()) / 86400000);
      return [`${years} Years, ${months} Months, ${days} Days`, `${Math.floor(totalDays/7)} Weeks`, `${totalDays} Total Days`];
    }
    case 'date-difference-calculator': {
      const { date1, date2 } = inputs;
      if (!date1 || !date2) return null;
      const d1 = new Date(date1), d2 = new Date(date2);
      const diff = Math.abs(d2.getTime() - d1.getTime());
      const days = Math.floor(diff / 86400000);
      return [`${days} Days`, `${Math.floor(days/7)} Weeks`, `${(days/30.44).toFixed(1)} Months`, `${(days/365.25).toFixed(2)} Years`];
    }
    case 'time-converter': {
      const { value, from, to } = inputs;
      if (value === '' || value === undefined || !from || !to) return null;
      const factors: Record<string,number> = { s:1, min:60, hr:3600, day:86400, wk:604800 };
      const result = parseFloat(value) * factors[from] / factors[to];
      return [result.toFixed(6).replace(/\.?0+$/, '')];
    }
    case 'tip-calculator': {
      const { bill, tipPercent, people } = inputs;
      if (!bill || !tipPercent || !people) return null;
      const totalTip = parseFloat(bill) * parseFloat(tipPercent) / 100;
      const totalBill = parseFloat(bill) + totalTip;
      return ['$' + totalTip.toFixed(2), '$' + totalBill.toFixed(2), '$' + (totalBill / parseFloat(people)).toFixed(2)];
    }
    case 'fuel-cost-calculator': {
      const { distance, efficiency, price } = inputs;
      if (!distance || !efficiency || !price) return null;
      const liters = parseFloat(distance) / parseFloat(efficiency);
      const cost = liters * parseFloat(price);
      return ['$' + cost.toFixed(2), liters.toFixed(2) + ' L', (cost / parseFloat(distance) * 100).toFixed(2) + ' $/100km'];
    }
    case 'discount-calculator': {
      const { original, discount } = inputs;
      if (!original || !discount) return null;
      const discountAmt = parseFloat(original) * parseFloat(discount) / 100;
      return ['$' + discountAmt.toFixed(2), '$' + (parseFloat(original) - discountAmt).toFixed(2), discount + '% Off'];
    }
    case 'gst-calculator': {
      const { amount, rate, type } = inputs;
      if (!amount || !rate) return null;
      const a = parseFloat(amount), r = parseFloat(rate) / 100;
      if (type === 'exclusive') {
        const gst = a * r;
        return ['$' + gst.toFixed(2), '$' + (a + gst).toFixed(2)];
      } else {
        const gst = a - a / (1 + r);
        return ['$' + gst.toFixed(2), '$' + (a - gst).toFixed(2)];
      }
    }
    case 'word-counter': {
      const text = inputs.text || '';
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const sentences = text.split(/[.!?]+/).filter(Boolean).length;
      const paragraphs = text.split(/\n+/).filter(Boolean).length;
      const readTime = Math.ceil(words / 200);
      return [words.toString(), text.length.toString(), sentences.toString(), paragraphs.toString(), readTime + ' min read'];
    }
    case 'character-counter': {
      const text = inputs.text || '';
      return [text.length.toString(), text.replace(/\s/g, '').length.toString(), text.replace(/[^a-zA-Z]/g, '').length.toString(), text.replace(/[^0-9]/g, '').length.toString()];
    }
    case 'slug-generator': {
      const text = inputs.text || '';
      return [text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim()];
    }
    case 'case-converter': {
      const text = inputs.text || '';
      const mode = inputs.mode || 'lower';
      if (mode === 'lower') return [text.toLowerCase()];
      if (mode === 'upper') return [text.toUpperCase()];
      if (mode === 'title') return [text.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase())];
      if (mode === 'camel') return [text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())];
      if (mode === 'snake') return [text.toLowerCase().replace(/\s+/g, '_')];
      return [text];
    }
    case 'password-generator': {
      const length = parseInt(inputs.length) || 12;
      const useUpper = inputs.uppercase !== 'false';
      const useNumbers = inputs.numbers !== 'false';
      const useSymbols = inputs.symbols !== 'false';
      let charset = 'abcdefghijklmnopqrstuvwxyz';
      if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (useNumbers) charset += '0123456789';
      if (useSymbols) charset += '!@#$%^&*()_+-=[]{}';
      let pwd = '';
      for (let i = 0; i < length; i++) pwd += charset[Math.floor(Math.random() * charset.length)];
      const strength = length >= 16 && useUpper && useNumbers && useSymbols ? 'Very Strong 💪' : length >= 12 ? 'Strong ✅' : 'Moderate ⚠️';
      return [pwd, strength];
    }
    case 'uuid-generator': {
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return [uuid];
    }
    case 'base64-encoder': {
      const text = inputs.text || '';
      const mode = inputs.mode || 'encode';
      try {
        const result = mode === 'encode' ? btoa(unescape(encodeURIComponent(text))) : decodeURIComponent(escape(atob(text)));
        return [result];
      } catch { return ['Invalid input']; }
    }
    case 'json-formatter': {
      const text = inputs.text || '';
      try {
        const parsed = JSON.parse(text);
        return [JSON.stringify(parsed, null, 2), 'Valid JSON ✅', Object.keys(parsed).length + ' keys'];
      } catch (e: any) { return ['Invalid JSON ❌', e.message]; }
    }
    case 'number-base-converter': {
      const { value, from, to } = inputs;
      if (!value || !from || !to) return null;
      const decimal = parseInt(value, parseInt(from));
      if (isNaN(decimal)) return ['Invalid input'];
      return [decimal.toString(parseInt(to)).toUpperCase(), 'Decimal: ' + decimal];
    }
    case 'random-number-generator': {
      const min = parseFloat(inputs.min) || 0;
      const max = parseFloat(inputs.max) || 100;
      const count = parseInt(inputs.count) || 1;
      const nums = Array.from({length: count}, () => Math.floor(Math.random() * (max - min + 1)) + min);
      return [nums.join(', '), 'Min: ' + min, 'Max: ' + max];
    }
    default:
      return ['This calculator is coming soon!'];
  }
};
