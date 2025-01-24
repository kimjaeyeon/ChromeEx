// 이 페이지는 함수 및 모듈을 Export 하기 위한 곳



export async function getActiveTabURL() {
    let queryOptions = { active: true, currentWindow: true }; // 현재 창에서 활성 탭만을 찾기 위한 옵션
    let [tab] = await chrome.tabs.query(queryOptions); // `chrome.tabs.query`를 사용하여 탭 정보를 가져옴
    return tab; // 활성화된 탭의 정보를 반환
}