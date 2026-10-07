export type GiRules={privateTuitionCap:number;onlineHousing:number;booksMaximum:number;booksPerCredit:number};
export function giEstimate(rules:GiRules,input:{benefit:number;credits:number;fullTimeCredits:number;annualCredits:number;months:number;tuition:number;privateSchool:boolean;online:boolean;housing:number;eligibleHousing:boolean;booksAlreadyPaid:number}){
 if(![50,60,70,80,90,100].includes(input.benefit)||(!Number.isFinite(input.fullTimeCredits)||input.fullTimeCredits<=0)||[input.credits,input.annualCredits,input.months,input.tuition,input.housing,input.booksAlreadyPaid].some(n=>!Number.isFinite(n)||n<0)||input.months>12)throw new Error('Enter valid benefit, credit and cost values.');
 const level=input.benefit/100;const pursuit=Math.min(1,input.credits/input.fullTimeCredits);const roundedPursuit=Math.round(pursuit*10)/10;const monthlyHousing=input.eligibleHousing&&pursuit>0.5?Math.round((input.online?rules.onlineHousing:input.housing)*level*roundedPursuit):0;
 const tuitionCovered=Math.round(Math.min(input.tuition,input.privateSchool?rules.privateTuitionCap:input.tuition)*level);const books=Math.max(0,Math.min(Math.round(rules.booksPerCredit*Math.min(input.annualCredits,24)*level),Math.round(rules.booksMaximum*level)-input.booksAlreadyPaid));
 return {monthlyHousing,annualHousing:Math.round(monthlyHousing*input.months),books,tuitionCovered,outOfPocket:input.tuition-tuitionCovered,pursuit:roundedPursuit};
}

