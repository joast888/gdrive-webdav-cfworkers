import {client_id, client_secret, refresh_token, root} from './config.json';

/**
 * @param {Object} data
 * @returns {string}
 */
function enQuery(data) {
    const ret = [];
    for (const key in data) {
        ret.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    }
    return ret.join('&');
}

export default class GoogleDrive {
    constructor() {
        this.accessToken = null;
        this.expires = null;
        this.fileURI = 'https://www.googleapis.com/drive/v3/files';
        // this.uploadURI = 'https://www.googleapis.com/upload/drive/v3/files';
        this.oauthURI = 'https://www.googleapis.com/oauth2/v4/token';
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccessToken() {
        if (this.accessToken === null || this.expires < Date.now()) {
            console.log('getAccessToken:', 'get accessToken');
            const postData = {
                client_id: client_id,
                client_secret: client_secret,
                refresh_token: refresh_token,
                grant_type: 'refresh_token'
            };
            const requestOption = {
                method: 'POST',
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                body: enQuery(postData)
            };
            const response = await fetch(this.oauthURI, requestOption);
            const data = await response.json();
            console.log(data);
            if (data['access_token'] !== undefined) {
                this.accessToken = data['access_token'];
                this.expires = new Date(Date.now() + 55 * 60 * 1000);
            }
        }
        return this.accessToken;
    }

    /**
     * @returns {Promise<Object>}
     */
    async requestOption() {
        return {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${await this.getAccessToken()}`,
                'content-type': 'application/json'
            }
        }
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async itemId(path) {
        // TODO get item id
    }

    /**
     * @param {string} path
     * @param {string} range
     * @returns {Promise<Response>}
     */
    async fetchFile(path, range = '') {
        console.log('fetchFile', path, range);
        const id = await this.itemId(path);
        if (id !== null) {
            const url = `${this.fileURI}/${id}?alt=media`;
            const option = await this.requestOption();
            option.headers['Range'] = range;
            return await fetch(url, option);
        } else {
            return new Response(null, {status: 404});
        }
    }

    /**
     * @param {string} path
     * @returns {Promise<void>}
     */
    async fetchList(path) {
        // TODO fetch list
    }
}