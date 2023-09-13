#  Bases de données


### Theme Data
<pre>{{ theme }}</pre>

### Page Data
<pre>{{ page }}</pre>

### Page Frontmatter
<pre>{{ frontmatter }}</pre>
<script setup>
import { useData } from 'vitepress'
const { site, theme, page, frontmatter } = useData()



</script>