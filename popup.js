import {getActiveTabURL} from "./utils.js"

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarksElement, bookmark) => {
    
};

const viewBookmarks = (currentBookmarks=[]) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";

    if(currentBookmarks.length >0){
        for(let i=0;i<currentBookmarks.length;i++)
        {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        }
    }else{
        bookmarksElement.innerHTML = '<i class = "row">No bookmarks to show </i>'
    }
};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};


// DOMContentLoaded 이벤트 리스너: HTML 문서가 완전히 로드되었을 때 실행됩니다.
document.addEventListener("DOMContentLoaded", async () => {

    // 현재 활성 탭의 URL 정보를 가져옵니다.
    const activeTab = await getActiveTabURL(); // getActiveTabURL 함수는 비동기로 활성 탭 정보를 반환해야 합니다.
    console.log(activeTab.url)

    // URL에서 쿼리 파라미터를 분리합니다.
    const queryParameters = activeTab.url.split("?")[1]; // "?" 이후의 쿼리 파라미터 부분을 가져옵니다.
    const urlParameters = new URLSearchParams(queryParameters); // URLSearchParams 객체로 쿼리 파라미터를 분석합니다.

    // "v" 파라미터 (유튜브 비디오 ID)를 가져옵니다.
    const currentVideo = urlParameters.get("v");


    // URL이 유튜브 비디오 페이지인지 확인하고, 비디오 ID가 존재할 경우 실행합니다.
    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    
        // Chrome의 storage API를 사용하여 현재 비디오와 관련된 북마크 데이터를 가져옵니다.
        chrome.storage.sync.get([currentVideo], (data) => {
            // 비디오 ID에 해당하는 북마크 데이터를 JSON으로 파싱하거나 기본값으로 빈 배열을 설정합니다.
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
            //viewbookmark
            viewBookmarks(currentVideoBookmarks)
        });
    } else {
        // 현재 탭이 유튜브 비디오 페이지가 아니면, 컨테이너의 내용을 다음과 같이 변경합니다.
        document.getElementsByClassName("container")[0].innerHTML = '<div class="title">This is not a youtube video page.</div>';
    }
});

// Content Script에서 메시지를 받는 리스너 등록
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "PAGE_TITLE") {
      // 받은 데이터를 Popup에 표시
      document.getElementById("title").textContent = message.title;
  
      // 응답 메시지
      sendResponse({ status: "Title received!" });
    }
  });