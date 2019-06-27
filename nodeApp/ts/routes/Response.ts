import Express = require('express');


export interface MyRes extends Express.Response{
    render:any;
    flash:any;
    redirect:any;
} 