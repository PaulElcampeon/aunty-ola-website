import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Keyboard, Mic, MessageCircle, Sparkles, Send, Trash2, Play, Square, Headphones } from 'lucide-react';
import KeyboardModal from './KeyboardModal';
import { getFromStorage } from '../utils/Storage';
import toast from 'react-hot-toast';
import { TextResponseArea } from './TextResponseArea';
import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc';


const greetingMessages = [
  '😂😂 Ah my pikin, come here jare! \n\nGood morning o! How you dey? You don chop? Abi you wan faint like mosquito wey drink sniper? Come make I give you small food before breeze blow you comot for here. \n\n🤣🤣 You know say this life no balance — but as long as you dey my side, na enjoyment remain!',
  'How you dey na? You don baff? Abi you still dey waka upandan with last night smell? Come make I check ya head small, make sure say no village people dey follow you! 😂😂\n\nI swear, na you remain for this life — make dem no stress you oh! If anybody near you today, just tell dem say "my Aunty don give me confidence, I no get time for wahala!',
  '😂😂 Ehen! My pikin! You don chop? Abi you wan faint like mosquito wey miss blood?\n\nCome make I see you well — no let hunger disgrace our lineage today oh! 😄',
  '😂😂 Ah my pikin, come here jare! \n\nGood morning o! How you dey? You don chop? Abi you wan faint like mosquito wey drink sniper? Come make I give you small food before breeze blow you comot for here. \n\n🤣🤣 You know say this life no balance — but as long as you dey my side, na enjoyment remain!',
  'Heii! My pikin, see as you fine like person wey dem dash data! 😄 You sure say na this morning you wake up? Or you still dey dream?\n\nAbeg come greet your Aunty before I call village people for you oh! 😂',
  'Omo mi! You dey waka like person wey landlord pursue for night 😂😂\n\nCome siddon jare, make I give you gist — this life no hard if you dey follow Aunty waka!',
  '😂 See my pikin oh! You don dey shine teeth like who win awoof!\n\nAbeg come chop before breeze carry you — hunger no go use you rehearse for Nollywood today!'
]

export default function ChatInterface() {
  const [isKeyboardModalOpen, setIsKeyboardModalOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [responseAudio, setResponseAudio] = useState<string | null>(null);

  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetingMessages.length);
    setResponse(greetingMessages[randomIndex])
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopRecording();
    };
  }, []);

  // Memoize the TextResponseArea to prevent unnecessary re-renders
  const memoizedResponseArea = useMemo(() => (
    <TextResponseArea response={response} />
  ), [response])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16,
          volume: 1
        }
      });

      streamRef.current = stream;

      recorderRef.current = new RecordRTCPromisesHandler(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1, // mono
        desiredSampRate: 16000,
        disableLogs: true,
        timeSlice: 5000, // Update each second
        ondataavailable: (blob) => {
          // Optional: Handle streaming audio data
          console.log('Audio data available:', blob.size, 'bytes');
        }
      });

      await recorderRef.current.startRecording();
      setIsRecording(true);
      setShowControls(false);
      setAudioBlob(null);
      setResponseAudio(null);

      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 15) { // Max 60 seconds
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast.error('Unable to access microphone');
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current && isRecording) {
      try {
        await recorderRef.current.stopRecording();
        const blob = await recorderRef.current.getBlob();

        // Ensure it's a WAV blob
        const wavBlob = new Blob([blob], { type: 'audio/wav' });
        setAudioBlob(wavBlob);
        setShowControls(true);

        // Create URL for recorded audio
        if (recordedAudioRef.current) {
          const audioUrl = URL.createObjectURL(wavBlob);
          recordedAudioRef.current.src = audioUrl;
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        setIsRecording(false);
      } catch (error) {
        console.error('Error stopping recording:', error);
        toast.error('Error stopping recording');
        setIsRecording(false);
      }
    }
  };

  const handleVoiceButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePlayRecorded = () => {
    if (recordedAudioRef.current) {
      if (isPlayingRecorded) {
        recordedAudioRef.current.pause();
        recordedAudioRef.current.currentTime = 0;
      } else {
        recordedAudioRef.current.play();
      }
      setIsPlayingRecorded(!isPlayingRecorded);
    }
  };

  const handlePlayResponse = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDeleteAudio = () => {
    setAudioBlob(null);
    setShowControls(false);
    if (recordedAudioRef.current) {
      recordedAudioRef.current.src = '';
    }
  };

  const handleSendAudio = async () => {
    if (!audioBlob) {
      toast.error('No audio recording found');
      return;
    }

    setIsWaiting(true);
    setResponse('Processing your audio...');

    try {
      // Verify the blob is valid
      if (!(audioBlob instanceof Blob)) {
        throw new Error('Invalid audio data');
      }

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/v1/bot/ask/audio', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      // Handle text response
      if (data.response) {
        setResponse(data.response);
      }

      // Handle audio binary data
      if (data.audio) {
        // Convert base64 to binary
        const binaryString = window.atob(data.audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Create blob from binary data
        const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });

        // Cleanup previous audio URL if exists
        if (responseAudio) {
          URL.revokeObjectURL(responseAudio);
        }

        // Create new audio URL
        const audioUrl = URL.createObjectURL(audioBlob);
        setResponseAudio(audioUrl);
      }

      setShowControls(false);
    } catch (error) {
      console.error('Error sending audio:', error);

      let errorMessage = 'Failed to send audio';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setResponse('Sorry, I encountered an error while processing your audio.');
    } finally {
      setIsWaiting(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    setError('');

    if (!message.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsWaiting(true);
    setResponse('Thinking...');
    setIsKeyboardModalOpen(false);
    const token = getFromStorage('aunty_ola_token');

    try {
      const response = await fetch('/api/v1/bot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: message.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResponse(data.response || 'No response received');
      }

      if (response.status === 403) {
        // data.message
        toast.error("You no longer have any more free requests, subscribe to get full access");
        setResponse('Come on go and subscribe now...');
      }

      if (response.status === 401) {
        toast.error("Create an account to get 2 free requests");
        setResponse('Come on go and subscribe now...');
      }
    } catch (err) {

    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-2">
      <div className="bg-white rounded-3xl px-4 pt-6 pb-2 floating-card relative overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-nigerian-gold-500 to-nigerian-purple-600 p-1 rounded-full">
            <img
              src="/images/logo.png"
              alt="Aunty Ola Logo"
              className="w-12 h-12 rounded-full border-2 border-white/20"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600 bg-clip-text text-transparent">
              Ask Aunty Ola
            </h2>
            <p className="text-sm text-gray-500">Ask Aunty Ola for advice on everyday life</p>
          </div>
        </div>

        <div className="relative w-full min-h-[250px] p-4 pr-12 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nigerian-purple-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-700">
          {memoizedResponseArea}
          {isWaiting && (
            <div className="absolute right-4 top-4 animate-spin">
              <Sparkles className="w-5 h-5 text-nigerian-purple-500" />
            </div>
          )}
          {responseAudio && (
            <button
              onClick={handlePlayResponse}
              className="absolute right-4 bottom-4 text-nigerian-purple-600 hover:text-nigerian-purple-700 transition-colors"
            >
              {isPlaying ? (
                <Square className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
          )}
        </div>


        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => !isWaiting && setIsKeyboardModalOpen(true)}
            disabled={isWaiting || isRecording}
            className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-nigerian-gold-500 hover:to-nigerian-purple-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group bg-white border border-gray-200"
          >
            <Keyboard className="w-6 h-6 group-hover:text-white text-gray-600" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleVoiceButtonClick}
              disabled={isWaiting}
              className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md ${isRecording
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white border border-gray-200 hover:bg-gradient-to-r hover:from-nigerian-gold-500 hover:to-nigerian-purple-600 hover:text-white transition-all'
                }`}
            >
              <Mic className={`w-5 h-5 ${isRecording ? 'text-white animate-pulse' : 'text-gray-600 group-hover:text-white'}`} />
              {isRecording && (
                <span className="text-sm font-medium">{recordingTime}s</span>
              )}
            </button>
            {showControls && (
              <>
                <button
                  onClick={handlePlayRecorded}
                  className="py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-nigerian-gold-500 hover:to-nigerian-purple-600 hover:text-white transition-all group bg-white border border-gray-200 shadow-md flex items-center justify-center"
                >
                  {isPlayingRecorded ? (
                    <Square className="w-5 h-5 group-hover:text-white text-gray-600" />
                  ) : (
                    <Headphones className="w-5 h-5 group-hover:text-white text-gray-600" />
                  )}
                </button>

                <button
                  onClick={handleSendAudio}
                  className="py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-nigerian-gold-500 hover:to-nigerian-purple-600 hover:text-white transition-all group bg-white border border-gray-200 shadow-md flex items-center justify-center"
                >
                  <Send className="w-5 h-5 group-hover:text-white text-gray-600" />
                </button>
                <button
                  onClick={handleDeleteAudio}
                  className="py-3 px-4 rounded-xl hover:bg-red-500 hover:text-white transition-all group bg-white border border-gray-200 shadow-md flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5 group-hover:text-white text-gray-600" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <KeyboardModal
        isOpen={isKeyboardModalOpen}
        onClose={() => setIsKeyboardModalOpen(false)}
        onSend={handleSendMessage}
      />

      {responseAudio && (
        <audio
          ref={audioRef}
          src={responseAudio}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      <audio
        ref={recordedAudioRef}
        onEnded={() => setIsPlayingRecorded(false)}
        className="hidden"
      />
    </div>
  );
}