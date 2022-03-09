import * as buffer from 'buffer/';

global.Buffer = buffer.Buffer;

import * as sizeOf from 'image-size';

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
    const response = await fetch(request.url, request)
    const htmlRewriter = new HTMLRewriter();
    return htmlRewriter.on('img', new StabilizeImages()).transform(response);
}

class StabilizeImages {
    async element(element) {
        try {
            if (element.hasAttribute('width') && element.hasAttribute('height')) {
                // Image already has dimensions set so we don't need to do anything
                return;
            }

            // Get the image's src attribute, if it was one
            const src = (element.getAttribute('src') || '').trim();

            if (!src) {
                console.warn('Image has no src attribute');
                return;
            }

            // Get the image's dimensions
            const imgResponse = await fetch(src);
            const imgBuffer = Buffer.from(await imgResponse.arrayBuffer());
            const {width, height} = sizeOf(imgBuffer);

            console.log('Setting image with dimensions:', 'width:', width, 'height:', height);

            // Set the dimensions on the HTML image tag
            element.setAttribute('width', width);
            element.setAttribute('height', height);

        } catch(error) {
            console.error('Failed to apply image stabilization on image', error);
        }
    }
}