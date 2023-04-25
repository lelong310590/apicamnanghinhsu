export default class ResponseFormat{
  data: any
  success:boolean
  message: string
  constructor(data, success, message){
    this.data = data
    this.success = success
    this.message = message
  }
}
