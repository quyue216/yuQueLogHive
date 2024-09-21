import { ref, watchEffect, toValue } from 'vue'
import axios from "@/axios/index.js";
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const isLoading  = ref(null)
  
  watchEffect(async () => {
    // reset state before fetching..
    data.value = null
    error.value = null
    isLoading.value  = true
    const urlValue = toValue(url)
    
    try {

    	const res = await axios(urlValue)
	    data.value = res;
      isLoading.value = false;
    } catch (e) {
      isLoading.value = false;
      error.value = e
    }
  })

  return { data, error , isLoading}
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