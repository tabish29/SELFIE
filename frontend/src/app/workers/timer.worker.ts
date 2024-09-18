let timerId: any = null;

onmessage = function (event) {
  if (event.data.action === 'start') {
    const interval = event.data.interval;

    if (!timerId) {
      timerId = setInterval(() => {
        postMessage('tick'); 
      }, interval);
    }
  } else if (event.data.action === 'stop') {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
};