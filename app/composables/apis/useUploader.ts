import { ref, computed } from 'vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

export function useFileUpload() {
  const previewUrl = ref<string | null>(null)
  const panUrl = ref<string | null>(null)
  const AadharFrontUrl = ref<string | null>(null)
  const AadharBackUrl = ref<string | null>(null)
  const STOREURL = ref<string | null>(null)
  const file = ref<File | null>(null)

  const cropImage = ref<string | null>(null) // raw image selected/captured
  const croppedImage = ref<string | null>(null) // after cropping
  const cropperRef = ref(null)
  const currentDocId = ref<string | null>(null) // track which doc (PAN, Aadhaar, Store)

  /**
   * Take photo using Capacitor Camera
   */
  async function takePhoto(filename: string) {
    await Camera.checkPermissions();
    await Camera.requestPermissions;
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 90
    })

    //previewUrl.value = photo.dataUrl

    // convert base64 to File
    const blob = await fetch(photo.dataUrl!).then(r => r.blob())
    file.value = new File([blob], `photo_${Date.now()}.jpg`, { type: blob.type })
    if (filename === "63_Pan_Card_front") {
      uploadFile("63",filename)
    } else if (filename === "55_Aadhar_Card_front") {
      uploadFile("55",filename)
    } else if (filename === "55_Aadhar_Card_back") {
      uploadFile("55",filename)
    } else {
      uploadFile("999",filename)
    }
    
  }

    async function takePhotoDesktop(filename: string, id: any) {
    console.log("MerchatId", id);
    
    await Camera.checkPermissions();
    await Camera.requestPermissions;
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 90
    })

    //previewUrl.value = photo.dataUrl

    // convert base64 to File
    const blob = await fetch(photo.dataUrl!).then(r => r.blob())
    file.value = new File([blob], `photo_${Date.now()}.jpg`, { type: blob.type })
    if (filename === "63_Pan_Card_front") {
      uploadFileDesktop("63",filename,id)
    } else if (filename === "55_Aadhar_Card_front") {
      uploadFileDesktop("55",filename,id)
    } else if (filename === "55_Aadhar_Card_back") {
      uploadFileDesktop("55",filename,id)
    } else {
      uploadFileDesktop("999",filename,id)
    }
    
  }

  /**
   * Build FormData with additional fields
   */
  function buildFormData( docId: string , filename?: string) {
    if (!file.value) throw new Error('No file selected or captured')

    const formData = new FormData()
    formData.append('file', file.value, filename || file.value.name)
    formData.append('docId', docId)
    formData.append('filename', filename || file.value.name)

    return formData
  }

    function buildFormDataDesktop( docId: string , filename?: string, merchantId?: any) {
    if (!file.value) throw new Error('No file selected or captured')

    const formData = new FormData()
    formData.append('file', file.value, filename || file.value.name)
    formData.append('docId', docId)
    formData.append('filename', filename || file.value.name)
    formData.append('merchantId', merchantId)

    return formData
  }

  /**
   * Upload file with metadata
   */
  async function uploadFile(
    docId: string,
    filename?: string
  ) {
    const formData = buildFormData(docId,filename)
    const runtimeConfig = useRuntimeConfig();

    const token = localStorage.getItem("token");
    const res = await fetch( runtimeConfig.public.API_ENDPOINT + "/OnboadingImages", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    if (!res.ok) throw new Error(`Upload failed: ${res.status}`)

    const result = await res.json()
    console.log("✅ Upload response:", result)

    if (filename === "63_Pan_Card_front") {
      panUrl.value = result.data[0].url
    } else if (filename === "55_Aadhar_Card_front") {
      AadharFrontUrl.value = result.data[0].url
    } else if (filename === "55_Aadhar_Card_back") {
      AadharBackUrl.value = result.data[0].url
    } else {
      STOREURL.value = result.data[0].url
    }

    return result

  }

    async function uploadFileDesktop(
    docId: string,
    filename?: string,
    merchantId?: any
  ) {
    const formData = buildFormDataDesktop(docId,filename,merchantId)
    const runtimeConfig = useRuntimeConfig();

    const token = localStorage.getItem("token");
    const res = await fetch( runtimeConfig.public.API_ENDPOINT + "/OnboadingImages", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    if (!res.ok) throw new Error(`Upload failed: ${res.status}`)

    const result = await res.json()
    console.log("✅ Upload response:", result)

    // here you can set response to your refs (panUrl, AadharFrontUrl, etc)
    if (filename === "63_Pan_Card_front") {
      panUrl.value = result.data[0].url
    } else if (filename === "55_Aadhar_Card_front") {
      AadharFrontUrl.value = result.data[0].url
    } else if (filename === "55_Aadhar_Card_back") {
      AadharBackUrl.value = result.data[0].url
    } else {
      STOREURL.value = result.data[0].url
    }

    return result

  }

  const isValid = computed(() => {
    return (
      panUrl.value !== null &&
      AadharFrontUrl.value !== null &&
      AadharBackUrl.value !== null &&
      STOREURL.value !== null
    )
  })

  return {
    previewUrl,
    file,
    takePhoto,
    buildFormData,
    uploadFile,
    uploadFileDesktop,
    takePhotoDesktop,
    panUrl,
    AadharFrontUrl,
    AadharBackUrl,
    STOREURL,
    isValid
  }
}
