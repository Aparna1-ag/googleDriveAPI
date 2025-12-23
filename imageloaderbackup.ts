// import { useEffect, useState } from 'react'

// import './App.css'
// import { serverName } from './App'


// function Images() {

//   const [urls, setUrls] = useState([])
//   let userId = '693bf75b51146f6dd0818d8a'




//   useEffect(() => {



//     const fetchFiles = async () => {
//       try {
//         const url = `http://localhost:3603/allfiles/${userId}`
  
//         const res =  await fetch(url)
//         const result = await res.json()
  
//         // console.log(result)
//         setUrls(result.allFiles)
  
//       } catch (err) {
//         console.log(err)
//       }
//     }

//     fetchFiles()
//   }, [])

//   // let userId = '693bf75b51146f6dd0818d8c'



  



//   const urlList = urls.map(item => item?.url)

//   console.log(urlList)




//   return (
//     <>
//   <div className='w-3/4 mx-auto'>
//   {urls.length && urls.map(item => (
//     //  <div key={item._id}>
//     //    <img src={`https://drive.google.com/thumbnail?id=${item.url}&sz=w800`} height={'auto'}   />
//     //  </div>

//     <div key={item._id}>
//     <img src={`${serverName}/files/${item.url}`} className='w-full h-auto'   />
//   </div>
//     ))}
//   </div>
//     </>
//   )
// }

// export default Images
