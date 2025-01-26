// chrome.runtime.onInstalled.addListener(()=>{
//     chrome.tabs.create({
//     url : 'https://www.naver.com'
// })

// chrome.tabs.onCreated.addListener(()=>{
//   console.log('create')
// })

// chrome.tabs.onActivated.addListener(()=>{
//   console.log('activate')
// })


chrome.tabs.onUpdated.addListener((tabId,changeInfo, tab) => {
  
  // console.log('hello')
  // 1. 'tab.url'이 존재하고, YouTube 동영상 URL인지 확인

  if (changeInfo.status === 'complete') {
    //console.log(`Tab ${tabId} status changed to: ${changeInfo.status}`);
    // console.log('complete')
}

  if (changeInfo.status ==='complete' && tab.url && tab.url.includes("youtube.com/watch")) {
      // 2. URL에서 쿼리 문자열(? 이후 부분) 분리
      const queryParameters = tab.url.split("?")[1];

      // 3. URLSearchParams 객체를 생성해 파라미터를 쉽게 추출
      const urlParameters = new URLSearchParams(queryParameters);

      // 4. 'v'라는 파라미터 값을 가져옴 (YouTube 동영상 ID)
      // console.log(urlParameters.get("v"));

      // 5. Content Script로 메시지를 보냄
      chrome.tabs.sendMessage(tabId, {
          type: "NEW", // 메시지 타입 지정
          videoId: urlParameters.get("v"), // 동영상 ID 전달
      });
  }
});