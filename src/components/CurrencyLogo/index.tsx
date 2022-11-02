import { Currency } from '@uniswap/sdk-core'
import { SupportedChainId } from 'constants/chains'
import TokenLogoLookupTable from 'constants/TokenLogoLookupTable'
import { NATIVE_CHAIN_ID, nativeOnChain } from 'constants/tokens'
import { CHAIN_NAME_TO_CHAIN_ID } from 'graphql/data/util'
import useCurrencyLogoURIs from 'lib/hooks/useCurrencyLogoURIs'
import React, { useMemo } from 'react'
import styled from 'styled-components/macro'

import Logo from '../Logo'

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background: radial-gradient(white 50%, #ffffff00 calc(75% + 1px), #ffffff00 100%);
  border-radius: 50%;
  -mox-box-shadow: 0 0 1px black;
  -webkit-box-shadow: 0 0 1px black;
  box-shadow: 0 0 1px black;
  border: 0px solid rgba(255, 255, 255, 0);
`

const StyledNativeLogo = styled(StyledLogo)`
  -mox-box-shadow: 0 0 1px white;
  -webkit-box-shadow: 0 0 1px white;
  box-shadow: 0 0 1px white;
`

export default function CurrencyLogo({
  currency,
  symbol,
  size = '24px',
  style,
  src,
  ...rest
}: {
  currency?: Currency | null
  symbol?: string | null
  size?: string
  style?: React.CSSProperties
  src?: string | null
}) {
  const logoURIs = useCurrencyLogoURIs(currency)
  const srcs = useMemo(() => (src ? [src, ...logoURIs] : logoURIs), [src, logoURIs])
  const props = {
    alt: `${currency?.symbol ?? 'token'} logo`,
    size,
    srcs,
    symbol: symbol ?? currency?.symbol,
    style,
    ...rest,
  }

  return currency?.isNative ? <StyledNativeLogo {...props} /> : <StyledLogo {...props} />
}

export function TokenLogo({
  token,
  size = '24px',
  style,
  ...rest
}: {
  token: {
    address?: string
    chain?: string
    chainId?: number
    symbol: string | null
    project?: {
      logoUrl: string | null
    } | null
  }
  size?: string
  style?: React.CSSProperties
}) {
  const chainId = token.chainId ?? (token.chain ? CHAIN_NAME_TO_CHAIN_ID[token.chain] : SupportedChainId.MAINNET)
  const isNative = token.address === NATIVE_CHAIN_ID
  const nativeCurrency = isNative ? nativeOnChain(chainId) : undefined
  const currency = useMemo(
    () => ({
      chainId,
      address: token.address,
      isNative: token.address === NATIVE_CHAIN_ID,
      logoURI: TokenLogoLookupTable.checkIcon(token.address) ?? token.project?.logoUrl,
    }),
    [chainId, token.address, token.project?.logoUrl]
  )
  const logoURIs = useCurrencyLogoURIs(nativeCurrency ?? currency)

  const props = {
    alt: `${token.symbol ?? 'token'} logo`,
    size,
    srcs: logoURIs,
    symbol: token.symbol,
    style,
    ...rest,
  }

  return token.address === NATIVE_CHAIN_ID ? <StyledNativeLogo {...props} /> : <StyledLogo {...props} />
}
