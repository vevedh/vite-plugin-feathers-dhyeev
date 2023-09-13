export default {
    async paths() {
      const infos = await (await fetch('http://localhost:3030/api/checkdb?database=databases')).json()
      const res = []
      const tbs = infos.map( (infoDb) => {
        const sb = infoDb.tables.map((col) => {
            res.push({ params:{ db:`${infoDb.name}`,col:`${col.name}`} })
            return col.name
        })
        console.log('Info test :',res)
      })
      //console.log('Info tablest :',tbs)
      return res
    }
  }