const axiosUtils = require('../src/utils/axios.utils');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);

const url = '/some/api/url';
const successResponse = createResponseMock('success');
const errorResponse = createResponseMock('error');

describe('getRequest()', () => {
    it('should make request and handle success response', (done) => {
        mock.onGet(url).reply(200, successResponse);

        axiosUtils.getRequest(url, successCallback(done), errorCallback(done));
    });

    it('should make request and handle error response', (done) => {
        mock.onGet(url).reply(500, errorResponse);

        axiosUtils.getRequest(url, successCallback(done), errorCallback(done));
    });
});

function createResponseMock(message) {
    return {
        data: { message }
    };
}

function successCallback(done) {
    return (success) => {
        expect(success.data).toStrictEqual(successResponse);
        done();
    };
}

function errorCallback(done) {
    return (error) => {
        expect(error.response.data).toStrictEqual(errorResponse);
        done();
    };
}
