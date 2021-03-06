import { createTimeout } from '@bigcommerce/request-sender';
import { getCustomerResponseBody } from './internal-customers.mock';
import { getResponse } from '../common/http-request/responses.mock';
import CustomerRequestSender from './customer-request-sender';

describe('CustomerRequestSender', () => {
    let customerRequestSender;
    let requestSender;

    beforeEach(() => {
        requestSender = {
            delete: jest.fn(() => Promise.resolve()),
            post: jest.fn(() => Promise.resolve()),
        };

        customerRequestSender = new CustomerRequestSender(requestSender);
    });

    describe('#signInCustomer()', () => {
        let credentials;
        let response;

        beforeEach(() => {
            credentials = { email: 'foo@bar.com', password: 'foobar' };
            response = getResponse(getCustomerResponseBody());

            requestSender.post.mockReturnValue(Promise.resolve(response));
        });

        it('posts customer credentials', async () => {
            const output = await customerRequestSender.signInCustomer(credentials);

            expect(output).toEqual(response);
            expect(requestSender.post).toHaveBeenCalledWith('/internalapi/v1/checkout/customer', {
                body: credentials,
            });
        });

        it('posts customer credentials with timeout', async () => {
            const options = { timeout: createTimeout() };
            const output = await customerRequestSender.signInCustomer(credentials, options);

            expect(output).toEqual(response);
            expect(requestSender.post).toHaveBeenCalledWith('/internalapi/v1/checkout/customer', {
                ...options,
                body: credentials,
            });
        });
    });

    describe('#signOutCustomer()', () => {
        let response;

        beforeEach(() => {
            response = getResponse(getCustomerResponseBody());

            requestSender.delete.mockReturnValue(Promise.resolve(response));
        });

        it('signs out customer', async () => {
            const output = await customerRequestSender.signOutCustomer();

            expect(output).toEqual(response);
            expect(requestSender.delete).toHaveBeenCalledWith('/internalapi/v1/checkout/customer', { timeout: undefined });
        });

        it('signs out customer with timeout', async () => {
            const options = { timeout: createTimeout() };
            const output = await customerRequestSender.signOutCustomer(options);

            expect(output).toEqual(response);
            expect(requestSender.delete).toHaveBeenCalledWith('/internalapi/v1/checkout/customer', options);
        });
    });
});
