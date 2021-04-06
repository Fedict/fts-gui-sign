import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { IntlProvider } from 'react-intl'

function render(ui, { locale = 'en', ...renderOptions } = {}) {
    function Wrapper({ children }) {
        return <IntlProvider locale={locale}>{children}</IntlProvider>
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { render }

export const verifyCancelButton = (getByText) => {
    const buttonElement = getByText(/Cancel/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.id).toEqual("button_cancel");
    buttonElement.click();
}