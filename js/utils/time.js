const single_steps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
const three_steps = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57];
const four_steps = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56];
const twelve_steps = [0, 12, 24, 36, 48];
const ten_steps = [0, 10, 20, 30, 40, 50];
const twenty_steps = [0, 20, 40];
const one_step = [0];
const no_tick = [];

/**
 * Time extension extends tick view on main page.
 * @type {{startTime: Time.startTime, stopTime: Time.stopTime}}
 */
const Time = {

  wt_ticks: {
    'xde': {
      minutes: true,
      '00': ten_steps, '01': ten_steps, '02': ten_steps, '03': ten_steps, '04': ten_steps,
      '05': ten_steps, '06': ten_steps, '07': ten_steps, '08': ten_steps, '09': ten_steps,
      '10': ten_steps, '11': ten_steps, '12': ten_steps, '13': ten_steps, '14': ten_steps,
      '15': ten_steps, '16': ten_steps, '17': ten_steps, '18': ten_steps, '19': ten_steps,
      '20': ten_steps, '21': ten_steps, '22': ten_steps, '23': ten_steps
    },
    'sde': {
      minutes: true,
      '00': three_steps, '01': three_steps, '02': three_steps, '03': three_steps, '04': three_steps,
      '05': three_steps, '06': three_steps, '07': three_steps, '08': three_steps, '09': three_steps,
      '10': three_steps, '11': three_steps, '12': three_steps, '13': three_steps, '14': three_steps,
      '15': three_steps, '16': three_steps, '17': three_steps, '18': three_steps, '19': three_steps,
      '20': three_steps, '21': three_steps, '22': three_steps, '23': three_steps
    },
    'rde': {
      minutes: true,
      '00': single_steps, '01': single_steps, '02': single_steps, '03': single_steps, '04': single_steps, '05': single_steps, '06': single_steps,
      '07': single_steps, '08': single_steps, '09': single_steps, '10': single_steps, '11': single_steps, '12': single_steps, '13': single_steps,
      '14': single_steps, '15': single_steps, '16': single_steps, '17': single_steps, '18': single_steps, '19': single_steps, '20': single_steps,
      '21': single_steps, '22': single_steps, '23': single_steps
    },
    'cde': {
      minutes: true,
      '00': [three_steps], '01': three_steps, '02': three_steps, '03': three_steps, '04': three_steps,
      '05': three_steps, '06': three_steps, '07': three_steps, '08': three_steps, '09': three_steps,
      '10': three_steps, '11': three_steps, '12': three_steps, '13': three_steps, '14': three_steps,
      '15': three_steps, '16': three_steps, '17': three_steps, '18': three_steps, '19': three_steps,
      '20': three_steps, '21': three_steps, '22': three_steps, '23': three_steps
    },
    'dde': {
      minutes: true,
      '00': three_steps, '01': three_steps, '02': three_steps, '03': three_steps, '04': three_steps,
      '05': three_steps, '06': three_steps, '07': three_steps, '08': three_steps, '09': three_steps,
      '10': three_steps, '11': three_steps, '12': three_steps, '13': three_steps, '14': three_steps,
      '15': three_steps, '16': three_steps, '17': three_steps, '18': three_steps, '19': three_steps,
      '20': three_steps, '21': three_steps, '22': three_steps, '23': three_steps
    },
    'ede': {
      minutes: true,
      '00': three_steps, '01': three_steps, '02': three_steps, '03': three_steps, '04': three_steps,
      '05': three_steps, '06': three_steps, '07': three_steps, '08': three_steps, '09': three_steps,
      '10': three_steps, '11': three_steps, '12': three_steps, '13': three_steps, '14': three_steps,
      '15': three_steps, '16': three_steps, '17': three_steps, '18': three_steps, '19': three_steps,
      '20': three_steps, '21': three_steps, '22': three_steps, '23': three_steps
    },
    'bde': {
      minutes: false,
      '00': ten_steps, '01': ten_steps, '02': ten_steps, '03': ten_steps, '04': ten_steps,
      '05': ten_steps, '06': ten_steps, '07': ten_steps, '08': ten_steps, '09': ten_steps,
      '10': ten_steps, '11': ten_steps, '12': ten_steps, '13': ten_steps, '14': ten_steps,
      '15': ten_steps, '16': ten_steps, '17': ten_steps, '18': ten_steps, '19': ten_steps,
      '20': ten_steps, '21': ten_steps, '22': ten_steps, '23': ten_steps, '24': ten_steps,
      '25': ten_steps, '26': ten_steps, '27': ten_steps, '28': ten_steps, '29': ten_steps,
      '30': ten_steps, '31': ten_steps, '32': ten_steps, '33': ten_steps, '34': ten_steps,
      '35': ten_steps, '36': ten_steps, '37': ten_steps, '38': ten_steps, '39': ten_steps,
      '40': ten_steps, '41': ten_steps, '42': ten_steps, '43': ten_steps, '44': ten_steps,
      '45': ten_steps, '46': ten_steps, '47': ten_steps, '48': ten_steps, '49': ten_steps,
      '50': ten_steps, '51': ten_steps, '52': ten_steps, '53': ten_steps, '54': ten_steps,
      '55': ten_steps, '56': ten_steps, '57': ten_steps, '58': ten_steps, '59': ten_steps,
    }
  },

  kt_ticks: {
    'xde': {
      minutes: true,
      '00': one_step, '01': one_step, '02': one_step, '03': one_step, '04': one_step, '05': one_step, '06': one_step, '07': one_step,
      '08': one_step, '09': one_step, '10': one_step, '11': one_step, '12': one_step, '13': one_step, '14': one_step, '15': one_step,
      '16': one_step, '17': one_step, '18': one_step, '19': one_step, '20': one_step, '21': one_step, '22': one_step, '23': one_step
    },
    'sde': {
      minutes: true,
      '00': twelve_steps, '01': twelve_steps, '02': twelve_steps, '03': twelve_steps, '04': twelve_steps,
      '05': twelve_steps, '06': twelve_steps, '07': twelve_steps, '08': twelve_steps, '09': twelve_steps,
      '10': twelve_steps, '11': twelve_steps, '12': twelve_steps, '13': twelve_steps, '14': twelve_steps,
      '15': twelve_steps, '16': twelve_steps, '17': twelve_steps, '18': twelve_steps, '19': twelve_steps,
      '20': twelve_steps, '21': twelve_steps, '22': twelve_steps, '23': twelve_steps
    },
    'rde': {
      minutes: true,
      '00': four_steps, '01': four_steps, '02': four_steps, '03': four_steps, '04': four_steps,
      '05': four_steps, '06': four_steps, '07': four_steps, '08': four_steps, '09': four_steps,
      '10': four_steps, '11': four_steps, '12': four_steps, '13': four_steps, '14': four_steps,
      '15': four_steps, '16': four_steps, '17': four_steps, '18': four_steps, '19': four_steps,
      '20': four_steps, '21': four_steps, '22': four_steps, '23': four_steps
    },
    'cde': {
      minutes: true,
      '00': three_steps, '01': three_steps, '02': three_steps, '03': three_steps, '04': three_steps,
      '05': three_steps, '06': three_steps, '07': three_steps, '08': three_steps, '09': three_steps,
      '10': three_steps, '11': three_steps, '12': three_steps, '13': three_steps, '14': three_steps,
      '15': three_steps, '16': three_steps, '17': three_steps, '18': three_steps, '19': three_steps,
      '20': three_steps, '21': three_steps, '22': three_steps, '23': three_steps
    },
    'dde': {
      minutes: true,
      '00': no_tick, '01': one_step, '02': no_tick, '03': one_step, '04': no_tick,
      '05': one_step, '06': no_tick, '07': one_step, '08': twenty_steps, '09': twenty_steps,
      '10': twenty_steps, '11': twenty_steps, '12': twenty_steps, '13': twenty_steps, '14': twenty_steps,
      '15': twenty_steps, '16': twenty_steps, '17': twenty_steps, '18': twenty_steps, '19': twenty_steps,
      '20': twenty_steps, '21': twenty_steps, '22': twenty_steps, '23': one_step
    },
    'ede': {
      minutes: true,
      '00': twelve_steps, '01': twelve_steps, '02': twelve_steps, '03': twelve_steps, '04': twelve_steps,
      '05': twelve_steps, '06': twelve_steps, '07': twelve_steps, '08': twelve_steps, '09': twelve_steps,
      '10': twelve_steps, '11': twelve_steps, '12': twelve_steps, '13': twelve_steps, '14': twelve_steps,
      '15': twelve_steps, '16': twelve_steps, '17': twelve_steps, '18': twelve_steps, '19': twelve_steps,
      '20': twelve_steps, '21': twelve_steps, '22': twelve_steps, '23': twelve_steps
    },
    'bde': {
      minutes: false,
      '00': one_step, '01': one_step, '02': one_step, '03': one_step, '04': one_step,
      '05': one_step, '06': one_step, '07': one_step, '08': one_step, '09': one_step,
      '10': one_step, '11': one_step, '12': one_step, '13': one_step, '14': one_step,
      '15': one_step, '16': one_step, '17': one_step, '18': one_step, '19': one_step,
      '20': one_step, '21': one_step, '22': one_step, '23': one_step, '24': one_step,
      '25': one_step, '26': one_step, '27': one_step, '28': one_step, '29': one_step,
      '30': one_step, '31': one_step, '32': one_step, '33': one_step, '34': one_step,
      '35': one_step, '36': one_step, '37': one_step, '38': one_step, '39': one_step,
      '40': one_step, '41': one_step, '42': one_step, '43': one_step, '44': one_step,
      '45': one_step, '46': one_step, '47': one_step, '48': one_step, '49': one_step,
      '50': one_step, '51': one_step, '52': one_step, '53': one_step, '54': one_step,
      '55': one_step, '56': one_step, '57': one_step, '58': one_step, '59': one_step,
    }
  },

  timer: undefined,

  /**
   * Start the tick timer, switch into battle mode.
   */
  startTime: function () {
    let today = new Date();
    let h = Time.checkTime(today.getHours());
    let m = Time.checkTime(today.getMinutes());
    let s = Time.checkTime(today.getSeconds());
    document.getElementById('tb_time1').innerHTML = h + ':' + m + ':' + s;

    let serverWtTicks = Time.wt_ticks[window.server];
    if (serverWtTicks) {
      if(serverWtTicks.minutes) {
        let nextWt = Time.findNextTick(serverWtTicks, h, m);
        document.getElementById('tb_time2').innerHTML = 'T - ' + nextWt;
      } else {
        let nextWt = Time.findNextTickInSeconds(serverWtTicks, m, s);
        document.getElementById('tb_time2').innerHTML = 'T - ' + nextWt;
      }
    }
    let serverKtTicks = Time.kt_ticks[window.server];
    if (serverKtTicks) {
      if(serverKtTicks.minutes) {
        let nextKt = Time.findNextTick(serverKtTicks, h, m);
        let ktTimer = document.getElementById('tb_time3');
        ktTimer.innerHTML = 'T - ' + nextKt;
        if (nextKt === 1) {
          ktTimer.classList.add('highlight')
        } else {
          ktTimer.classList.remove('highlight')
        }
      } else {
        let nextKt = Time.findNextTickInSeconds(serverKtTicks, m, s);
        let ktTimer = document.getElementById('tb_time3');
        ktTimer.innerHTML = 'T - ' + nextKt;
        if (nextKt <= 10) {
          ktTimer.classList.add('highlight')
        } else {
          ktTimer.classList.remove('highlight')
        }
      }
    }
    Time.timer = setTimeout(Time.startTime, 500);
  },

  /**
   * Restore the tick view.
   */
  stopTime: function () {
    clearTimeout(Time.timer);
    let today = new Date();
    let h = Time.checkTime(today.getHours());
    let m = Time.checkTime(today.getMinutes());
    document.getElementById('tb_time1').innerHTML = h + ':' + m;
    let serverWtTicks = Time.wt_ticks[window.server];
    if (serverWtTicks) {
      let nextWt = Time.findNextTick(serverWtTicks, h, m);
      let wt = new Date(today.getTime() + nextWt * 60000);
      let wt_h = Time.checkTime(wt.getHours());
      let wt_m = Time.checkTime(wt.getMinutes());
      document.getElementById('tb_time2').innerHTML = wt_h + ':' + wt_m;
    }
    let serverKtTicks = Time.kt_ticks[window.server];
    if (serverKtTicks) {
      let nextKt = Time.findNextTick(serverKtTicks, h, m);
      let kt = new Date(today.getTime() + nextKt * 60000);
      let kt_h = Time.checkTime(kt.getHours());
      let kt_m = Time.checkTime(kt.getMinutes());
      let ktTimer = document.getElementById('tb_time3');
      ktTimer.classList.remove('highlight');
      ktTimer.innerHTML = kt_h + ':' + kt_m;
    }
  },

  /**
   * Add leading zero to time integer.
   * @param {number}i the time-part integer
   * @return {string} the time-part with leading zero.
   */
  checkTime: function (i) {
    return (i < 10) ? '0' + i : '' +i;
  },

  /**
   * Get remaining minutes until next tick from tick configuration.
   * @param serverTicks the server tick config
   * @param h the hour
   * @param m the minute
   * @return {number|*} the remaining minutes until tick.
   */
  findNextTick (serverTicks, h, m) {
    let currentHourTicks = serverTicks[h];
    let nextTickIndex = currentHourTicks.findIndex(element => element > parseInt(m));
    let nextTick = 0;
    if (nextTickIndex === -1) {
      if (h === '23') {
        for (let i = 0; i <= 23; i++) {
          let hourTicks = serverTicks[Time.checkTime(i)];
          if (hourTicks.length === 0) {
            nextTick += 60;
            continue;
          }
          nextTick += 60 - parseInt(m) + hourTicks[0];
          i = 25;
        }
      } else {
        for (let i = parseInt(h); i <= 23; i++) {
          let hourTicks = serverTicks[Time.checkTime(i)];
          if (hourTicks.length === 0) {
            if(i === parseInt(h)) {
              nextTick += 60 - parseInt(m);
            } else {
              nextTick += 60;
            }
            continue;
          }
          let firstTick = hourTicks[0];
          if(i === parseInt(h) && parseInt(m) >= firstTick) {
            nextTick += 60 - parseInt(m) + firstTick;
            i = 25;
          } else {
            nextTick += firstTick;
            i = 25;
          }
        }
        if (nextTick === 0) {
          for (let i = 0; i < parseInt(h); i++) {
            let hourTicks = serverTicks[Time.checkTime(i)];
            if (hourTicks.length === 0) {
              nextTick += 60;
              continue;
            }
            nextTick += 60 - parseInt(m) + hourTicks[0];
          }
        }
      }
    } else {
      return currentHourTicks[nextTickIndex] - parseInt(m);
    }
    return nextTick;
  },

  /**
   * Get remaining seconds until next tick from tick configuration.
   * @param serverTicks the server tick config
   * @param m the minute
   * @param s the second
   * @return {number|*} the remaining minutes until tick.
   */
  findNextTickInSeconds (serverTicks, m, s) {
    let currentMinuteTicks = serverTicks[m];
    let nextTickIndex = currentMinuteTicks.findIndex(element => element > parseInt(s));
    let nextTick = 0;
    if (nextTickIndex === -1) {
      if (m === '59') {
        for (let i = 0; i <= 59; i++) {
          let minuteTicks = serverTicks[Time.checkTime(i)];
          if (minuteTicks.length === 0) {
            nextTick += 60;
            continue;
          }
          nextTick += 60 - parseInt(s) + minuteTicks[0];
          i = 61;
        }
      } else {
        for (let i = parseInt(m); i <= 59; i++) {
          let minuteTicks = serverTicks[Time.checkTime(i)];
          if (minuteTicks.length === 0) {
            if(i === parseInt(m)) {
              nextTick += 60 - parseInt(s);
            } else {
              nextTick += 60;
            }
            continue;
          }
          let firstTick = minuteTicks[0];
          if(i === parseInt(m) && parseInt(s) >= firstTick) {
            nextTick += 60 - parseInt(s) + firstTick;
            i = 61;
          } else {
            nextTick += firstTick;
            i = 61;
          }
        }
        if (nextTick === 0) {
          for (let i = 0; i < parseInt(m); i++) {
            let minuteTicks = serverTicks[Time.checkTime(i)];
            if (minuteTicks.length === 0) {
              nextTick += 60;
              continue;
            }
            nextTick += 60 - parseInt(s) + minuteTicks[0];
          }
        }
      }
    } else {
      return currentMinuteTicks[nextTickIndex] - parseInt(s);
    }
    return nextTick;
  }
};