// "matches": ["https://*.youtube.com/*"],

(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;

        console.log(videoId + type)

        if (type === "NEW") {        
            currentVideo = videoId;
            newVideoLoaded();
        }else if(type === "PLAY"){
            console.log(value)
            youtubePlayer.currentTime = value;
        }else if(type === "DELETE"){
            currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
            chrome.storage.sync.set({[currentVideo]: JSON.stringify(currentVideoBookmarks)});

            response(currentVideoBookmarks);
        }
    });

    // chrome.runtime.sendMessage({ title: "hello world" }, (response) => {
    //     console.log("Response from Popup:", response);
    // });

    const newVideoLoaded = async() => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        currentVideoBookmarks = await fetchBookmarks();

        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];

            youtubeLeftControls.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    }

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo],(obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [])
            })
        })
    }

    const addNewBookmarkEventHandler = async() => {
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };

        currentVideoBookmarks = await fetchBookmarks();

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        });
    }

     newVideoLoaded();
 })();

 const getTime = (t) => {
    // 기준 시간을 UTC 1970년 1월 1일로 설정하고 초를 밀리초로 추가
    var date = new Date(0);
    date.setSeconds(t);

    // ISO 문자열에서 시간 부분 추출 (HH:MM:SS)
    return date.toISOString().substr(11, 8);
};