const minutes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
const three_minutes = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57];
const four_minutes = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56];
const twelve_minutes = [0, 12, 24, 36, 48];
const ten_minutes = [0, 10, 20, 30, 40, 50];
const twenty_minutes = [0, 20, 40];
const hourly = [0];
const no_tick = [];

/**
 * Time extension extends tick view on main page.
 * @type {{startTime: Time.startTime, stopTime: Time.stopTime}}
 */
const Time = {

  wt_ticks: {
    'xde': {
      '00': ten_minutes, '01': ten_minutes, '02': ten_minutes, '03': ten_minutes, '04': ten_minutes,
      '05': ten_minutes, '06': ten_minutes, '07': ten_minutes, '08': ten_minutes, '09': ten_minutes,
      '10': ten_minutes, '11': ten_minutes, '12': ten_minutes, '13': ten_minutes, '14': ten_minutes,
      '15': ten_minutes, '16': ten_minutes, '17': ten_minutes, '18': ten_minutes, '19': ten_minutes,
      '20': ten_minutes, '21': ten_minutes, '22': ten_minutes, '23': ten_minutes
    },
    'sde': {
      '00': three_minutes, '01': three_minutes, '02': three_minutes, '03': three_minutes, '04': three_minutes,
      '05': three_minutes, '06': three_minutes, '07': three_minutes, '08': three_minutes, '09': three_minutes,
      '10': three_minutes, '11': three_minutes, '12': three_minutes, '13': three_minutes, '14': three_minutes,
      '15': three_minutes, '16': three_minutes, '17': three_minutes, '18': three_minutes, '19': three_minutes,
      '20': three_minutes, '21': three_minutes, '22': three_minutes, '23': three_minutes
    },
    'rde': {
      '00': minutes, '01': minutes, '02': minutes, '03': minutes, '04': minutes, '05': minutes, '06': minutes,
      '07': minutes, '08': minutes, '09': minutes, '10': minutes, '11': minutes, '12': minutes, '13': minutes,
      '14': minutes, '15': minutes, '16': minutes, '17': minutes, '18': minutes, '19': minutes, '20': minutes,
      '21': minutes, '22': minutes, '23': minutes
    },
    'cde': {
      '00': [three_minutes], '01': three_minutes, '02': three_minutes, '03': three_minutes, '04': three_minutes,
      '05': three_minutes, '06': three_minutes, '07': three_minutes, '08': three_minutes, '09': three_minutes,
      '10': three_minutes, '11': three_minutes, '12': three_minutes, '13': three_minutes, '14': three_minutes,
      '15': three_minutes, '16': three_minutes, '17': three_minutes, '18': three_minutes, '19': three_minutes,
      '20': three_minutes, '21': three_minutes, '22': three_minutes, '23': three_minutes
    },
    'dde': {
      '00': three_minutes, '01': three_minutes, '02': three_minutes, '03': three_minutes, '04': three_minutes,
      '05': three_minutes, '06': three_minutes, '07': three_minutes, '08': three_minutes, '09': three_minutes,
      '10': three_minutes, '11': three_minutes, '12': three_minutes, '13': three_minutes, '14': three_minutes,
      '15': three_minutes, '16': three_minutes, '17': three_minutes, '18': three_minutes, '19': three_minutes,
      '20': three_minutes, '21': three_minutes, '22': three_minutes, '23': three_minutes
    },
    'ede': {
      '00': three_minutes, '01': three_minutes, '02': three_minutes, '03': three_minutes, '04': three_minutes,
      '05': three_minutes, '06': three_minutes, '07': three_minutes, '08': three_minutes, '09': three_minutes,
      '10': three_minutes, '11': three_minutes, '12': three_minutes, '13': three_minutes, '14': three_minutes,
      '15': three_minutes, '16': three_minutes, '17': three_minutes, '18': three_minutes, '19': three_minutes,
      '20': three_minutes, '21': three_minutes, '22': three_minutes, '23': three_minutes
    }
  },

  kt_ticks: {
    'xde': {
      '00': hourly, '01': hourly, '02': hourly, '03': hourly, '04': hourly, '05': hourly, '06': hourly, '07': hourly,
      '08': hourly, '09': hourly, '10': hourly, '11': hourly, '12': hourly, '13': hourly, '14': hourly, '15': hourly,
      '16': hourly, '17': hourly, '18': hourly, '19': hourly, '20': hourly, '21': hourly, '22': hourly, '23': hourly
    },
    'sde': {
      '00': twelve_minutes, '01': twelve_minutes, '02': twelve_minutes, '03': twelve_minutes, '04': twelve_minutes,
      '05': twelve_minutes, '06': twelve_minutes, '07': twelve_minutes, '08': twelve_minutes, '09': twelve_minutes,
      '10': twelve_minutes, '11': twelve_minutes, '12': twelve_minutes, '13': twelve_minutes, '14': twelve_minutes,
      '15': twelve_minutes, '16': twelve_minutes, '17': twelve_minutes, '18': twelve_minutes, '19': twelve_minutes,
      '20': twelve_minutes, '21': twelve_minutes, '22': twelve_minutes, '23': twelve_minutes
    },
    'rde': {
      '00': four_minutes, '01': four_minutes, '02': four_minutes, '03': four_minutes, '04': four_minutes,
      '05': four_minutes, '06': four_minutes, '07': four_minutes, '08': four_minutes, '09': four_minutes,
      '10': four_minutes, '11': four_minutes, '12': four_minutes, '13': four_minutes, '14': four_minutes,
      '15': four_minutes, '16': four_minutes, '17': four_minutes, '18': four_minutes, '19': four_minutes,
      '20': four_minutes, '21': four_minutes, '22': four_minutes, '23': four_minutes
    },
    'cde': {
      '00': three_minutes, '01': three_minutes, '02': three_minutes, '03': three_minutes, '04': three_minutes,
      '05': three_minutes, '06': three_minutes, '07': three_minutes, '08': three_minutes, '09': three_minutes,
      '10': three_minutes, '11': three_minutes, '12': three_minutes, '13': three_minutes, '14': three_minutes,
      '15': three_minutes, '16': three_minutes, '17': three_minutes, '18': three_minutes, '19': three_minutes,
      '20': three_minutes, '21': three_minutes, '22': three_minutes, '23': three_minutes
    },
    'dde': {
      '00': no_tick, '01': hourly, '02': no_tick, '03': hourly, '04': no_tick,
      '05': hourly, '06': no_tick, '07': hourly, '08': twenty_minutes, '09': twenty_minutes,
      '10': twenty_minutes, '11': twenty_minutes, '12': twenty_minutes, '13': twenty_minutes, '14': twenty_minutes,
      '15': twenty_minutes, '16': twenty_minutes, '17': twenty_minutes, '18': twenty_minutes, '19': twenty_minutes,
      '20': twenty_minutes, '21': twenty_minutes, '22': twenty_minutes, '23': hourly
    },
    'ede': {
      '00': twelve_minutes, '01': twelve_minutes, '02': twelve_minutes, '03': twelve_minutes, '04': twelve_minutes,
      '05': twelve_minutes, '06': twelve_minutes, '07': twelve_minutes, '08': twelve_minutes, '09': twelve_minutes,
      '10': twelve_minutes, '11': twelve_minutes, '12': twelve_minutes, '13': twelve_minutes, '14': twelve_minutes,
      '15': twelve_minutes, '16': twelve_minutes, '17': twelve_minutes, '18': twelve_minutes, '19': twelve_minutes,
      '20': twelve_minutes, '21': twelve_minutes, '22': twelve_minutes, '23': twelve_minutes
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
      let nextWt = Time.findNextTick(serverWtTicks, h, m);
      document.getElementById('tb_time2').innerHTML = 'T - ' + nextWt;
    }
    let serverKtTicks = Time.kt_ticks[window.server];
    if (serverKtTicks) {
      let nextKt = Time.findNextTick(serverKtTicks, h, m);
      let ktTimer = document.getElementById('tb_time3');
      ktTimer.innerHTML = 'T - ' + nextKt;
      if (nextKt === 1) {
        ktTimer.classList.add('highlight')
      } else {
        ktTimer.classList.remove('highlight')
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
  }
};