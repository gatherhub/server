var label = {};

label.gatherhub = {
	en: 'GATHERHUB',
	cn: '云汇网',
	tw: '雲匯網'
};

label.signin = {
	en: 'Sign In',
	cn: '签入',
	tw: '簽入'
};

label.name = {
	en: 'Name',
	cn: '称呼',
	tw: '稱呼'
}

label.contact = {
	en: 'Email or Phone',
	cn: '电邮或电话号码',
	tw: '電子郵箱或電話號碼'
}

label.secret = {
	en: 'Secret (At least 6 characters)',
	cn: '密语 (至少六个字符)',
	tw: '密語 (至少六個字符)'
}

label.remember = {
	en: 'Remember me',
	cn: '记住我',
	tw: '記住我'
}

label.autosignin = {
	en: 'Auto-Signin',
	cn: '自动签入',
	tw: '自動簽入'
}

label.hidden = {
	en: 'Hidden',
	cn: '隐身',
	tw: '隱身'
}

label.enter = {
	en: 'Enter',
	cn: '进入',
	tw: '進入'
}

label.developby = {
	en: 'Developed by',
	cn: '开发制作',
	tw: '開發製作'
}

label.company = {
	en: 'Connective Dynsmics Workshop',
	cn: '互联动力工作室',
	tw: '互聯動力工作室'
}

label.contactus = {
	en: 'Contact Us',
	cn: '与我们联络',
	tw: '與我們聯絡'
}

function getLabel(lang) {
	var result = {};
	Object.keys(label).forEach(function(k) {
		result[k] = label[k][lang];
	});
	return result;
}

module.exports = getLabel;