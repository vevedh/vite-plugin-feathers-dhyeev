export default {
    async load() {
        const infos = await (await fetch('http://localhost:3030/api/checkdb?database=databases')).json()
        //console.log('Infos :',infos)
        return {
            data : infos
        }
    }
}