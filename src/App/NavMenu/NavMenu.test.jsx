/* Copyright (c) 2015 - 2017, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from 'react';
import { fireEvent } from '@testing-library/react';

import render from '../../../test/testrenderer';

import App from '../App';
import NavMenu from './NavMenu';

const aPane = ['an menu item', () => <div>A pane</div>];
const anotherPane = ['another menu item', () => <div>Another pane</div>];

const renderApp = panes => {
    const dummyReducer = (s = null) => s;
    const dummyNode = <div />;

    return render(<App
        appReducer={dummyReducer}
        deviceSelect={dummyNode}
        sidePanel={dummyNode}
        panes={panes}
    />);
};

expect.extend({
    toBeHighlighted(element) {
        const pass = element.classList.contains('selected');
        const not = pass ? 'not ' : '';
        const message = () => (
            `Expected the element to ${not}contain a class 'selected' to signify that `
            + `it is ${not}highlighted. It actually contained: ${element.className}`
        );
        return { pass, message };
    },
});

describe('NavMenu', () => {
    it('displays multiple items', () => {
        const { getByText } = render(<NavMenu panes={[aPane, anotherPane]} />);

        expect(getByText('an menu item')).toBeInTheDocument();
        expect(getByText('another menu item')).toBeInTheDocument();
    });

    it('has items that can be selected', () => {
        const { getByText, queryByText } = renderApp([aPane, anotherPane]);
        const menuItem = getByText('another menu item');

        expect(menuItem).not.toBeHighlighted();
        expect(getByText('A pane')).toBeInTheDocument();
        expect(queryByText('Another pane')).not.toBeInTheDocument();

        fireEvent.click(menuItem);

        expect(menuItem).toBeHighlighted();
        expect(queryByText('A pane')).not.toBeInTheDocument();
        expect(getByText('Another pane')).toBeInTheDocument();
    });

    it('automatically gets an About pane attached', () => {
        const { getByText } = render(<NavMenu panes={[aPane, anotherPane]} />);

        expect(getByText('About')).toBeInTheDocument();
    });
});
