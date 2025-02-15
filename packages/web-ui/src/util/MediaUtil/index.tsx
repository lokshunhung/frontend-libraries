import React from "react";
import ReactDOM from "react-dom/client";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import "./index.less";

function openImage(url: string) {
    return new Promise<void>(resolve => {
        const bodyElement = document.body;
        const divElement = document.createElement("div");
        const closeModal = () => {
            bodyElement.removeChild(divElement);
            resolve();
        };

        bodyElement.appendChild(divElement);
        ReactDOM.createRoot(divElement).render(
            <div onClick={closeModal} className="g-media-modal">
                <img src={url} />
                <CloseOutlined />
            </div>
        );
    });
}

function openVideo(url: string) {
    return new Promise<void>(resolve => {
        const bodyElement = document.body;
        const divElement = document.createElement("div");
        const closeModal = () => {
            bodyElement.removeChild(divElement);
            resolve();
        };

        ReactDOM.createRoot(divElement).render(
            <div onClick={closeModal} className="g-media-modal">
                <video src={url} autoPlay controls controlsList="nodownload" muted />
                <CloseOutlined />
            </div>
        );
        bodyElement.appendChild(divElement);
    });
}

function playAudio(url: string, amplitude: number = 1) {
    try {
        /**
         * Attention:
         * (1) For old browsers, Promise return value may be unsupported.
         * (2) For modern browsers, if the user never has interaction with the page, play() will reject.
         */
        const elementSource = new Audio(url);
        elementSource.crossOrigin = "anonymous";
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(elementSource);
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = amplitude;
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        elementSource.play().catch(() => {});
    } catch (e) {
        // Do nothing
    }
}

export const MediaUtil = Object.freeze({
    openImage,
    openVideo,
    playAudio,
});
