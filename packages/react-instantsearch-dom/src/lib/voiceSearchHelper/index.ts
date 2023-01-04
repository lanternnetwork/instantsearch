// copied from https://github.com/algolia/instantsearch.js/blob/688e36a67bb4c63d008d8abc02257a7b7c04e513/src/lib/voiceSearchHelper/index.ts

// #region wrong SpeechRecognition-related types
// This is not released in typescript yet, so we're copy&pasting the type definition from
// https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/924
export type SpeechRecognitionErrorCode =
  | 'aborted'
  | 'audio-capture'
  | 'bad-grammar'
  | 'language-not-supported'
  | 'network'
  | 'no-speech'
  | 'not-allowed'
  | 'service-not-allowed';

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
}
// #endregion wrong SpeechRecognition-related types

export type VoiceSearchHelperParams = {
  searchAsYouSpeak: boolean;
  language?: string;
  onQueryChange: (query: string) => void;
  onStateChange: () => void;
};

export type Status =
  | 'initial'
  | 'askingPermission'
  | 'waiting'
  | 'recognizing'
  | 'finished'
  | 'error';

export type VoiceListeningState = {
  status: Status;
  transcript: string;
  isSpeechFinal: boolean;
  errorCode?: SpeechRecognitionErrorCode;
};

export type VoiceSearchHelper = {
  getState: () => VoiceListeningState;
  isBrowserSupported: () => boolean;
  isListening: () => boolean;
  toggleListening: () => void;
  dispose: () => void;
};

export type ToggleListening = () => void;

export default function createVoiceSearchHelper({
  searchAsYouSpeak,
  language,
  onQueryChange,
  onStateChange,
}: VoiceSearchHelperParams): VoiceSearchHelper {
  const SpeechRecognitionAPI: new () => SpeechRecognition =
    (window as any).webkitSpeechRecognition ||
    (window as any).SpeechRecognition;
  const getDefaultState = (status: Status): VoiceListeningState => ({
    status,
    transcript: '',
    isSpeechFinal: false,
    errorCode: undefined,
  });
  let state: VoiceListeningState = getDefaultState('initial');
  let recognition: SpeechRecognition | undefined;

  const isBrowserSupported = (): boolean => Boolean(SpeechRecognitionAPI);

  const isListening = (): boolean =>
    state.status === 'askingPermission' ||
    state.status === 'waiting' ||
    state.status === 'recognizing';

  const setState = (newState: Partial<VoiceListeningState> = {}): void => {
    state = { ...state, ...newState };
    onStateChange();
  };

  const getState = (): VoiceListeningState => state;

  const resetState = (status: Status = 'initial'): void => {
    setState(getDefaultState(status));
  };

  const onStart = (): void => {
    setState({
      status: 'waiting',
    });
  };

  const onError = (event: SpeechRecognitionErrorEvent): void => {
    setState({ status: 'error', errorCode: event.error });
  };

  const onResult = (event: SpeechRecognitionEvent): void => {
    setState({
      status: 'recognizing',
      transcript:
        (event.results[0] &&
          event.results[0][0] &&
          event.results[0][0].transcript) ||
        '',
      isSpeechFinal: event.results[0] && event.results[0].isFinal,
    });
    if (searchAsYouSpeak && state.transcript) {
      onQueryChange(state.transcript);
    }
  };

  const onEnd = (): void => {
    if (!state.errorCode && state.transcript && !searchAsYouSpeak) {
      onQueryChange(state.transcript);
    }
    if (state.status !== 'error') {
      setState({ status: 'finished' });
    }
  };

  const start = (): void => {
    recognition = new SpeechRecognitionAPI();
    if (!recognition) {
      return;
    }
    resetState('askingPermission');
    recognition.interimResults = true;
    if (language) {
      recognition.lang = language;
    }
    recognition.addEventListener('start', onStart);
    // @ts-ignore: refer to the top `wrong SpeechRecognition-related types` comments
    recognition.addEventListener('error', onError);
    recognition.addEventListener('result', onResult);
    recognition.addEventListener('end', onEnd);
    recognition.start();
  };

  const dispose = (): void => {
    if (!recognition) {
      return;
    }
    recognition.stop();
    recognition.removeEventListener('start', onStart);
    // @ts-ignore: refer to the top `wrong SpeechRecognition-related types` comments
    recognition.removeEventListener('error', onError);
    recognition.removeEventListener('result', onResult);
    recognition.removeEventListener('end', onEnd);
    recognition = undefined;
  };

  const stop = (): void => {
    dispose();
    // Because `dispose` removes event listeners, `end` listener is not called.
    // So we're setting the `status` as `finished` here.
    // If we don't do it, it will be still `waiting` or `recognizing`.
    resetState('finished');
  };

  const toggleListening = (): void => {
    if (!isBrowserSupported()) {
      return;
    }
    if (isListening()) {
      stop();
    } else {
      start();
    }
  };

  return {
    getState,
    isBrowserSupported,
    isListening,
    toggleListening,
    dispose,
  };
}
