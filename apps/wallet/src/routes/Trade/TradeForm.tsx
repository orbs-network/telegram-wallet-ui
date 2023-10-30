// import {
//   VStack,
//   HStack,
//   IconButton,
//   Icon,
//   Text,
//   Container,
//   Box,
//   Avatar,
//   Divider,
//   useToast,
//   Drawer,
//   Flex,
//   DrawerContent,
//   DrawerOverlay,
//   DrawerCloseButton,
// } from '@chakra-ui/react';
// import { MdSwapVerticalCircle } from 'react-icons/md';
// import { TradeFormSchema } from './schema';
// import { TokenData } from '../../types';
// import BN from 'bignumber.js';
// import { BiSolidChevronRight } from 'react-icons/bi';


// import {
//   CryptoAmountInput,
//   SelectToken,
//   TokenSelect,
//   WalletSpinner,
// } from '../../components';
// import { useEffect, useState } from 'react';
// import { MainButton } from '@twa-dev/sdk/react';
// import { Button, colors } from '@telegram-wallet-ui/twa-ui-kit';
// import Twa from '@twa-dev/sdk';
// import { css, keyframes } from '@emotion/react';
// import { useNavigate } from 'react-router-dom';
// import { ROUTES } from '../../router/routes';
// import { useFetchLHQuote } from './hooks';
// import { amountUi } from '../../utils/conversion';

// export const QUOTE_REFETCH_INTERVAL = 10 * 1000;

// const flash = keyframes`
//   0% {
//     opacity: 1;
//   }

//   50% {
//     opacity: 0.1;
//   }

//   100% {
//     opacity: 1;
//   }
// `;

// const outAmountStyles = css`
//   animation: ${flash} 1s linear;
// `;

// type TradeFormProps = {
//   defaultValues: TradeFormSchema;
//   tokens: Record<string, TokenData> | undefined;
// };

// export function TradeForm({ defaultValues, tokens }: TradeFormProps) {
//   const [inToken, setInToken] = useState(defaultValues.inToken);
//   const [outToken, setOutToken] = useState(defaultValues.outToken);
//   const [inAmount, setInAmount] = useState(defaultValues.inAmount);
//   const [outAmount, setOutAmount] = useState(defaultValues.outAmount);
//   const [inError, setInError] = useState<string | undefined>(undefined);

//   useEffect(() => {
//     if (!tokens) {
//       return;
//     }

//     const value = BN(inAmount);

//     if (value.lte(0)) {
//       setInError('Please enter a positive amount');
//       return;
//     }

//     if (value.gt(tokens[inToken].balance)) {
//       setInError('Insufficient funds');
//       return;
//     }

//     setInError(undefined);
//   }, [inAmount, inToken, tokens]);

//   const navigate = useNavigate();
//   const onSubmit = () => {
//     if (inAmount === '') {
//       setInError('Please enter an amount');
//       return;
//     }

//     navigate(ROUTES.tradeReview, {
//       state: {
//         inAmount,
//         inToken,
//         outAmount,
//         outToken,
//       },
//     });
//   };

//   const {
//     data: quoteData,
//     isFetching: fetchingQuote,
//     isError,
//   } = useFetchLHQuote({
//     key: ['fetchQuote', inAmount],
//     srcAmount: inAmount,
//     srcToken: tokens && tokens[inToken],
//     dstToken: tokens && tokens[outToken],
//     enabled: inAmount !== '' && BN(inAmount).gt(0),
//     refetchInterval: QUOTE_REFETCH_INTERVAL,
//   });

//   const quote = async (value: string) => {
//     try {
//       if (!tokens) {
//         throw new Error('No tokens');
//       }

//       form.setValue('inAmount', value, {
//         shouldDirty: true,
//         shouldTouch: true,
//         shouldValidate: true,
//       });

//       // Get estimated out amount first
//       const estimatedOutAmount = await debouncedEstimate(
//         value,
//         tokens[inToken],
//         tokens[outToken]
//       );

//       if (estimatedOutAmount.eq(0)) {
//         throw new Error('Estimated out amount is 0');
//       }

//       form.setValue(
//         'outAmount',
//         estimatedOutAmount
//           .dividedBy(Math.pow(10, tokens[outToken].decimals))
//           .toString(),
//         { shouldDirty: true, shouldTouch: true }
//       );

//       // Then fetch LH quote
//       await fetchLHQuote(value, tokens[inToken], tokens[outToken]);
//       reset();
//       start();
//     } catch (err) {
//       console.error(err);
//       // TODO: show toast
//       toast({
//         description: 'Failed to get quote',
//         status: 'error',
//         duration: 5000,
//       });
//     }
//   };

//   useEffect(() => {
//     if (quoteData?.quote && tokens) {
//       setOutAmount(amountUi(tokens[outToken], BN(quoteData.quote.outAmount)));
//     }
//   }, [quoteData?.quote, tokens, outToken]);

//   const toast = useToast();

//   useEffect(() => {
//     if (isError) {
//       toast({
//         description: 'Error fetching quote',
//         status: 'error',
//       });
//       setInError('Enter a minimum amount equivalent to $1.00');
//     }
//   }, [isError, toast]);

//   if (!tokens) {
//     return (
//       <Container size="sm" height="100vh" position="relative">
//         <WalletSpinner />
//       </Container>
//     );
//   }

//   return (
//     <VStack alignItems="stretch" spacing={8}>
//       <VStack alignItems="stretch">
//         <HStack justifyContent="space-between">
//           <HStack>
//             <Avatar
//               src={tokens[inToken] && tokens[inToken].logoURI}
//               size="sm"
//             />
//             <Text>You pay</Text>
//           </HStack>
//           <Text size="sm">
//             Max:{' '}
//             {tokens[inToken] ? BN(tokens[inToken].balance).toFixed(5) : '0.00'}{' '}
//             <Text as="span" variant="hint">
//               {tokens[inToken] && tokens[inToken].symbol.toUpperCase()}
//             </Text>
//           </Text>
//         </HStack>
//         <HStack>
//           <CryptoAmountInput
//             hideSymbol
//             name="inAmount"
//             value={inAmount}
//             tokenSymbol={inToken}
//             onChange={(value) => {
//               setInAmount(value);
//             }}
//           />

//           <TokenSelect
//             name="inToken"
//             value={inToken}
//             onChange={(e) => {
//               setInToken(e.target.value);
//             }}
//           />
//         </HStack>

//         {inError && <Text color="red">{inError}</Text>}
//       </VStack>

//       <HStack justifyContent="flex-end">
//         <Divider variant="thick" />
//         <IconButton
//           aria-label="Switch"
//           width="auto"
//           backgroundColor="transparent"
//           isRound
//           icon={
//             <Icon
//               as={MdSwapVerticalCircle}
//               fontSize="5xl"
//               color={colors.button_color}
//             />
//           }
//           onClick={() => {
//             setInToken(outToken);
//             setOutToken(inToken);
//             setOutAmount('');
//             setInAmount('');
//           }}
//         />
//       </HStack>

//       <VStack alignItems="stretch">
//         <HStack>
//           <Avatar
//             src={tokens[outToken] && tokens[outToken].logoURI}
//             size="sm"
//           />
//           <Text>You receive</Text>
//         </HStack>
//         <HStack>
//           <Box css={fetchingQuote ? outAmountStyles : undefined}>
//             <CryptoAmountInput
//               hideSymbol
//               name="outAmount"
//               value={outAmount}
//               editable={false}
//               tokenSymbol={outToken}
//             />
//           </Box>
//           <TokenSelect
//             name="outToken"
//             value={outToken}
//             filterTokens={[inToken]}
//             onChange={(e) => {
//               setOutToken(e.target.value);
//               setOutAmount('');
//             }}
//           />
//         </HStack>
//       </VStack>
//       {!Twa.isVersionAtLeast('6.0.1') && (
//         <Button
//           variant="primary"
//           isDisabled={fetchingQuote || Boolean(inError)}
//           isLoading={fetchingQuote}
//           loadingText="Updating Quote"
//           onClick={onSubmit}
//         >
//           Review Trade
//         </Button>
//       )}
//       <MainButton
//         text={fetchingQuote ? 'Updating Quote' : 'Review Trade'}
//         disabled={fetchingQuote || Boolean(inError)}
//         onClick={onSubmit}
//         progress={fetchingQuote}
//       />
//     </VStack>
//   );
// }

// const TokenPanel = ({
//   value,
//   symbol,
//   name,
//   onChange,
//   onTokenSelect,
//   editable = false,
//   filterToken
// }: {
//   value: string;
//   symbol: string;
//   name: string;
//   onChange?: (value: string) => void;
//   onTokenSelect: (token: TokenData) => void;
//   editable?: boolean;
//   filterToken?: string;
// }) => {
//   return (
//     <Flex>
//       <CryptoAmountInput
//         hideSymbol
//         name={name}
//         value={value}
//         tokenSymbol={symbol}
//         onChange={onChange}
//         editable={editable}
//       />
//       <TokenSelectDrawer
//         filterToken={filterToken}
//         onSelect={onTokenSelect}
//         selected={symbol}
//       />
//     </Flex>
//   );
// };

// const TokenSelectDrawer = ({
//   onSelect,
//   selected,
//   filterToken,
// }: {
//   onSelect: (token: TokenData) => void;
//   selected?: string;
//   filterToken?: string;
// }) => {
//   const { data , dataUpdatedAt} = useUserData();
//   const [isOpen, setIsOpen] = useState(false);
//   const btnRef = useRef<any>();

//   const tokens = useMemo(() => {
//     if (!data) return []
//       return Object.values(data.tokens).filter(
//         (token) => token.symbol !== filterToken
//       );
      
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filterToken, dataUpdatedAt]); 

//   return (
//     <Flex alignItems="center">
//       <TokenSelectButton ref={btnRef.current} onClick={() => setIsOpen(true)}>
//         <Text>{selected ? selected?.toUpperCase() : 'Select Token'}</Text>
//         <BiSolidChevronRight />
//       </TokenSelectButton>
//       <Drawer
//         placement="bottom"
//         isOpen={isOpen}
//         onClose={() => setIsOpen(false)}
//         closeOnOverlayClick={true}
//         finalFocusRef={btnRef}
//       >
//         <DrawerOverlay />
//         <DrawerContent>
//           <DrawerCloseButton />
//           <StyledTokenList
//             onSelect={(token) => {
//               onSelect(token);
//               setIsOpen(false);
//             }}
//             tokens={tokens}
//           />
//         </DrawerContent>
//       </Drawer>
//     </Flex>
//   );
// };


// const TokenSelectButton = styled(Box)({
//   height:'auto',
//   display:'flex',
//   alignItems:'center',
//   "& p" :{
//     color:'#9D9D9D',
//     fontSize:'26px',
//     fontWeight: 700
//   },
//   svg: {
//     color:'#9D9D9D',
//     fontSize:'26px',
//   }
// })


// const StyledTokenList = styled(SelectToken)({
//   overflowY: 'auto',
// });
import React from 'react'

export function TradeForm() {
  return (
    <div>TradeForm</div>
  )
}

