import{d as l,u as r,h as p,j as i,B as e,c as _,D as s,w as m,l as d,o as h}from"./framework.af328a25.js";const u={class:"col q-gutter-sm q-pa-none",style:{"max-width":"100%"}},g=l({__name:"VVMyTable",setup(b){const{page:o,params:t}=r(),a=p([]);return i(async()=>{console.log("On load Table :",o),a.value=await(await fetch(`https://localhost:3030/mongo/${t.value.db}/${t.value.col}`)).json()}),(w,v)=>{const n=e("q-btn"),c=e("q-table");return h(),_("div",u,[s(c,{flat:"",bordered:"",title:d(o).params.col,rows:a.value,color:"primary",style:{"max-width":"100%"}},{"top-right":m(()=>[s(n,{color:"primary","icon-right":"archive",label:"Export to csv","no-caps":""})]),_:1},8,["title","rows"])])}}});export{g as _};