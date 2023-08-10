
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

import * as cocoSsd from '@tensorflow-models/coco-ssd';

import image1URL from './image1.jpg';
import image2URL from './image2.jpg';
import image3URL from './image3.jpg';
import image4URL from './image4.jpg';
import image5URL from './image5.jpg';
import image6URL from './image6.jpg';

let modelPromise;

window.onload = () =>  {
    modelPromise = cocoSsd.load();
    detect();
}


const select = document.getElementById('base_model');
select.onchange = async (event) => {
    const model = await modelPromise;
    model.dispose();
    modelPromise = cocoSsd.load(
        {base: event.srcElement.options[event.srcElement.selectedIndex].value});
    detect();
};

function detect() {
    const imgs = [
        image1URL,
        image2URL,
        image3URL,
        image4URL,
        image5URL,
        image6URL,
    ]

    const el = document.getElementById('images');
    el.innerHTML = '';
    imgs.map(async (img, i) => {
        let wrapper
        wrapper = document.createElement('div');
        wrapper.classList.add('images-wrapper');
        const imgEl = document.createElement('img');
        imgEl.src = img;
        imgEl.classList.add(`img-${i}`);
        wrapper.appendChild(imgEl);

        const canvas = document.createElement('canvas');
        canvas.id = `canvas-${i}`;
        canvas.width = 1280;
        canvas.height = 853;
        wrapper.appendChild(canvas);
        const model = await modelPromise;
        const result = await model.detect(imgEl);

        el.appendChild(wrapper)

        const c = document.getElementById(`canvas-${i}`);
        const context = c.getContext('2d');
        context.drawImage(imgEl, 0, 0);
        context.font = '10px Arial';

        console.log('number of detections: ', result.length);
        for (let i = 0; i < result.length; i++) {
            context.beginPath();
            context.rect(...result[i].bbox);
            context.lineWidth = 1;
            context.strokeStyle = 'green';
            context.fillStyle = 'green';
            context.stroke();
            context.fillText(
                result[i].score.toFixed(3) + ' ' + result[i].class, result[i].bbox[0],
                result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10);
        }
    });
}