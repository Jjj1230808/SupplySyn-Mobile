// Pro
// const Api = {
// 	"home": 'https://kimihomebe.schaefflercn.com/Home/EmployeeCardNoValidation?cardNo=',
// 	"account": 'https://kimihomebe.schaefflercn.com/Home/Login4Pda?',
// 	"gateway": 'https://kimigateway.schaefflercn.com/sc/gateway/api'

// }
let env = '';
env = process.env.NODE_ENV === 'development' ? 'prod' : 'prod'; //生产环境
// env = process.env.NODE_ENV === 'development' ? 'prodDev' : 'prodDev';//开发环境
env = process.env.NODE_ENV === 'development' ? 'test' : 'test'; //测试环境

const configs = {

	prod: {
		"home": 'https://kimihomebe.schaefflercn.com/Home/EmployeeCardNoValidation?cardNo=',
		"account": 'https://kimihomebe.schaefflercn.com/Home/Login4Pda?',
		"gateway": 'https://kimigateway.schaefflercn.com/sc/gateway/api'
	},
	test: {
		"home": 'https://qakimiworkbenchbe.schaefflercn.com/home/EmployeeCardNoValidation?cardNo=',
		"account": 'https://qakimiworkbenchbe.schaefflercn.com/home/Login4Pda?',
		"gateway": 'https://qakimigatewaybe.schaefflercn.com/sc/gateway/api'
	},




}


// Dev
// const Api={
// 	"home": 'https://qakimiworkbenchbe.schaefflercn.com/home/EmployeeCardNoValidation?cardNo=',
// 	"account": 'https://qakimiworkbenchbe.schaefflercn.com/home/Login4Pda?',
// 	"gateway": 'https://qakimigatewaybe.schaefflercn.com/sc/gateway/api'
// }

let config = configs[env];
export default config
