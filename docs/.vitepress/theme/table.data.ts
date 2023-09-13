import type { useData } from 'vitepress'

const config: any = (globalThis as any)

export default {
    async load() {
        //const {  page , params } = useData()
        console.log(`Loading :`,config)
        //const infos = await (await fetch(`http://localhost:3030/mongo/${params.value.db}/${params.value.col}`)).json()
        //console.log('Infos :',infos)
        return {
            data : ['infos']
        }
    }
}