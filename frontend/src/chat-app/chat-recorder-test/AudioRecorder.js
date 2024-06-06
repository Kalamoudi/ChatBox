// AudioRecorder.js
import React, { useState, useEffect, useRef } from 'react';
import './AudioRecorder.css';

const AudioRecorder = ({ onStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0)
  const audioChunks = useRef([]);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const recordingInterval = useRef(null);

  useEffect(() => {
    if (mediaRecorder) {
        setProgress(0)
        setRecordingDuration(0)
        mediaRecorder.ondataavailable = event => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mpeg' });
        audioChunks.current = [];
        setAudioBlob(audioBlob);
        clearInterval(recordingInterval.current);

        if (typeof onStop === 'function') {
          onStop(audioBlob);
        } else {
          console.error('onStop is not a function');
        }

        // Stop all media tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
    }
  }, [mediaRecorder, onStop]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.start();

      // Start the timer
      recordingInterval.current = setInterval(() => {
        setRecordingDuration(prevDuration => prevDuration + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    setIsRecording(false);
  };

  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      setPlaybackTime(Math.floor(audioRef.current.currentTime));
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('ended', handleEnded);
      }
    };
  }, []);



 // Inside the useEffect for isPlaying




useEffect(() => {
    let animationFrameId;
    
    const updateProgress = () => {
        const audioElement = audioRef.current;
        const currentTime = audioElement.currentTime;
        const duration = recordingDuration
        const newProgress = currentTime / duration * 100
        setProgress(newProgress)
        console.log("Current Time: " + currentTime)
        console.log("Duration: " + duration)
        console.log("Progress: " + newProgress)
      
      animationFrameId = requestAnimationFrame(updateProgress);
    };
  
    if (isPlaying) {
    animationFrameId = requestAnimationFrame(updateProgress);
    }
  
  
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);


  const fillingProgressBar = {
    height: `100%`,
    backgroundColor: `#5cb85c`,
    width: `${progress}%`,
  }
  
  
  

  return (
    <div className="audio-recorder">
      <div className="controls">
        <button className="record-btn" onClick={startRecording} disabled={isRecording}>
          Record
        </button>
        <button className="stop-btn" onClick={stopRecording} disabled={!isRecording}>
          Stop
        </button>
        <button className="play-btn" onClick={playAudio} disabled={!audioBlob}>
          Play
        </button>
      </div>
      {isRecording && <div className="duration">Recording: {formatTime(recordingDuration)}</div>}
      <div className="progress-bar">
        <div style={fillingProgressBar} ></div>
      </div>
      {audioBlob && <div className="timer">{formatTime(playbackTime)}</div>}
      <audio ref={audioRef} />
    </div>
  );
};

export default AudioRecorder;
