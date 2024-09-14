import { ref, watchEffect, toValue } from 'vue'
import axios from "@/axios/index.js";
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  
  watchEffect(async () => {
    // reset state before fetching..
    data.value = null
    error.value = null
    
   
    const urlValue = toValue(url)
    
    try {

    	const res = await axios(urlValue)
	    data.value = res;
    } catch (e) {
      error.value = e
    }
  })

  return { data, error }
}

// artificial delay
function timeout() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve()
      } else {
        reject(new Error('Random Error'))
      }
    }, 300)
  })
}