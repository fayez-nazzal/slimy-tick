import moment from 'moment';
import {
  findRepeatOptions,
  findDueDateOptions,
  findDueTimeOptions,
} from './regexAnalyzers';

describe('repeat options', () => {
  describe('minutes', () => {
    test('every 30 minutes', () => {
      expect(findRepeatOptions('every 30 minutes')).toEqual(['minutes', 30]);
    });

    test('every 59 minutes', () => {
      expect(findRepeatOptions('every 59 minutes')).toEqual(['minutes', 59]);
    });

    test('every 60 minutes', () => {
      expect(findRepeatOptions('every 60 minutes')).toEqual(['minutes', 60]);
    });

    test('every 120 minutes', () => {
      expect(findRepeatOptions('every 120 minutes')).toEqual(['minutes', 120]);
    });

    test('every 120 minute', () => {
      expect(findRepeatOptions('every 120 minute')).toEqual(['minutes', 120]);
    });
  });

  describe('hours', () => {
    test('every every hour', () => {
      expect(findRepeatOptions('every hour')).toEqual(['hours', 1]);
    });

    test('every every one hour', () => {
      expect(findRepeatOptions('every one hour')).toEqual(['hours', 1]);
    });

    test('every 2 hours', () => {
      expect(findRepeatOptions('every 2 hours')).toEqual(['hours', 2]);
    });

    test('every 23 hours', () => {
      expect(findRepeatOptions('every 23 hours')).toEqual(['hours', 23]);
    });

    test('every 23 hours (no space after)', () => {
      expect(findRepeatOptions('every 23hours')).toEqual(['hours', 23]);
    });

    test('every 24 hours', () => {
      expect(findRepeatOptions('every 24 hours')).toEqual(['hours', 24]);
    });

    test('every 25 hours', () => {
      expect(findRepeatOptions('every 25 hours')).toEqual(['hours', 25]);
    });

    test('every 48 hours', () => {
      expect(findRepeatOptions('every 48 hours')).toEqual(['hours', 48]);
    });

    test('every 5 hour (no s)', () => {
      expect(findRepeatOptions('every 5 hour')).toEqual(['hours', 5]);
    });
  });

  describe('days', () => {
    test('every day', () => {
      expect(findRepeatOptions('every day')).toEqual(['days', 1]);
    });

    test('everyday', () => {
      expect(findRepeatOptions('everyday')).toEqual(['days', 1]);
    });

    test('every 300 days', () => {
      expect(findRepeatOptions('every 300 days')).toEqual(['days', 300]);
    });

    test('every 5 day', () => {
      expect(findRepeatOptions('every 5 day')).toEqual(['days', 5]);
    });

    test('every 30a days (wrong)', () => {
      expect(findRepeatOptions('every 30a days')).toEqual([null, null]);
    });
  });

  describe('weeks', () => {
    test('every week', () => {
      expect(findRepeatOptions('every week')).toEqual(['weeks', 1]);
    });

    // this is wrong but a user may type it...
    test('everyweek', () => {
      expect(findRepeatOptions('everyweek')).toEqual(['weeks', 1]);
    });

    test('every 2 weeks', () => {
      expect(findRepeatOptions('every 2 weeks')).toEqual(['weeks', 2]);
    });
  });

  describe('months', () => {
    test('every month', () => {
      expect(findRepeatOptions('every month')).toEqual(['months', 1]);
    });

    test('every 22 months', () => {
      expect(findRepeatOptions('every 22 months')).toEqual(['months', 22]);
    });

    test('every 22 month', () => {
      expect(findRepeatOptions('every 22 month')).toEqual(['months', 22]);
    });
  });

  describe('years', () => {
    test('every year', () => {
      expect(findRepeatOptions('every year')).toEqual(['years', 1]);
    });

    test('every year', () => {
      expect(findRepeatOptions('every one year')).toEqual(['years', 1]);
    });

    test('every 2 years', () => {
      expect(findRepeatOptions('every 2 years')).toEqual(['years', 2]);
    });

    test('every 2 year (no s)', () => {
      expect(findRepeatOptions('every 2 year')).toEqual(['years', 2]);
    });
  });

  describe('times', () => {
    test('every 2:59AM', () => {
      expect(findRepeatOptions('every 2:59AM')).toEqual(['times', ['2:59AM']]);
    });

    test('every 5:55 AM', () => {
      expect(findRepeatOptions('every 5:55 AM')).toEqual([
        'times',
        ['5:55 AM'],
      ]);
    });

    test('tievery 14:00e 24h', () => {
      expect(findRepeatOptions('every 14:00')).toEqual(['times', ['14:00']]);
    });

    test('every 16:00', () => {
      expect(findRepeatOptions('every 16:00')).toEqual(['times', ['16:00']]);
    });

    test('every 24:00', () => {
      expect(findRepeatOptions('every 24:00')).toEqual([null, null]);
    });

    test('every 2:60PM (wrong)', () => {
      expect(findRepeatOptions('every 2:60PM')).toEqual([null, null]);
    });

    test('every 9:88AM wrong', () => {
      expect(findRepeatOptions('every 9:88AM')).toEqual([null, null]);
    });
  });

  describe('multiple times', () => {
    test('every 2:00AM and 5:25PM', () => {
      expect(findRepeatOptions('every 2:00AM and 5:25PM')).toEqual([
        'times',
        ['2:00AM', '5:25PM'],
      ]);
    });

    test('every 2:00AM and 14:00', () => {
      expect(findRepeatOptions('every 2:00AM and 14:00')).toEqual([
        'times',
        ['2:00AM', '14:00'],
      ]);
    });

    test('every 5:55 AM and 3:22', () => {
      expect(findRepeatOptions('every 5:55 AM and 3:22')).toEqual([
        'times',
        ['5:55 AM', '3:22'],
      ]);
    });

    test('every 5:55 AM 3:22', () => {
      expect(findRepeatOptions('every 5:55 AM 3:22')).toEqual([
        'times',
        ['5:55 AM', '3:22'],
      ]);
    });

    test('every 5:55 AM, 3:22', () => {
      expect(findRepeatOptions('every 5:55 AM, 3:22')).toEqual([
        'times',
        ['5:55 AM', '3:22'],
      ]);
    });

    test('every 2:00AM and 14:00 and 23:58', () => {
      expect(findRepeatOptions('every 2:00AM and 14:00 and 23:58')).toEqual([
        'times',
        ['2:00AM', '14:00', '23:58'],
      ]);
    });

    test('every 11:00AM and 16:00 and 28:58', () => {
      expect(findRepeatOptions('every 11:00AM and 16:00 and 28:58')).toEqual([
        'times',
        ['11:00AM', '16:00'],
      ]);
    });

    describe('daytimes', () => {
      test('every morning', () => {
        expect(findRepeatOptions('every morning')).toEqual(['mornings', 1]);
      });

      // user may type this in a hurry..
      test('everymorning', () => {
        expect(findRepeatOptions('everymorning')).toEqual(['mornings', 1]);
      });

      test('every afternoon', () => {
        expect(findRepeatOptions('every afternoon')).toEqual(['afternoons', 1]);
      });

      test('every evening', () => {
        expect(findRepeatOptions('every evening')).toEqual(['evenings', 1]);
      });

      test('every night', () => {
        expect(findRepeatOptions('every night')).toEqual(['nights', 1]);
      });

      test('every 5 mornings', () => {
        expect(findRepeatOptions('every 5 mornings')).toEqual(['mornings', 5]);
      });

      test('every 5 morning', () => {
        expect(findRepeatOptions('every 5 morning')).toEqual(['mornings', 5]);
      });

      test('every 20 nights', () => {
        expect(findRepeatOptions('every 20 nights')).toEqual(['nights', 20]);
      });
    });

    describe('multiple daytimes', () => {
      test('every morning and evening', () => {
        expect(findRepeatOptions('every morning and evening')).toEqual([
          'daytimes',
          ['morning', 'evening'],
        ]);
      });

      test('every evening afternoon', () => {
        expect(findRepeatOptions('every evening afternoon')).toEqual([
          'daytimes',
          ['evening', 'afternoon'],
        ]);
      });

      test('every morning, afternoon, night', () => {
        expect(findRepeatOptions('every morning, afternoon, night')).toEqual([
          'daytimes',
          ['morning', 'afternoon', 'night'],
        ]);
      });
    });
  });

  describe('testing weekdays', () => {
    test('every sunday', () => {
      expect(findRepeatOptions('every sunday')).toEqual(['weekdays', ['sun']]);
    });

    test('every sun', () => {
      expect(findRepeatOptions('every sun')).toEqual(['weekdays', ['sun']]);
    });

    test('every monday', () => {
      expect(findRepeatOptions('every monday')).toEqual(['weekdays', ['mon']]);
    });

    test('every mon', () => {
      expect(findRepeatOptions('every mon')).toEqual(['weekdays', ['mon']]);
    });

    test('every tuesday', () => {
      expect(findRepeatOptions('every tuesday')).toEqual(['weekdays', ['tue']]);
    });

    test('every tue', () => {
      expect(findRepeatOptions('every tue')).toEqual(['weekdays', ['tue']]);
    });

    test('every wedding !== every wednesday', () => {
      expect(findRepeatOptions('every wedding')).toEqual([null, null]);
    });

    test('every wednesday', () => {
      expect(findRepeatOptions('every wednesday')).toEqual([
        'weekdays',
        ['wed'],
      ]);
    });

    test('every wed', () => {
      expect(findRepeatOptions('every wed')).toEqual(['weekdays', ['wed']]);
    });

    test('every thursday', () => {
      expect(findRepeatOptions('every thursday')).toEqual([
        'weekdays',
        ['thu'],
      ]);
    });

    test('every thu', () => {
      expect(findRepeatOptions('>>>>every thu<<<<')).toEqual([
        'weekdays',
        ['thu'],
      ]);
    });

    test('every friday', () => {
      expect(findRepeatOptions(' every friday ')).toEqual([
        'weekdays',
        ['fri'],
      ]);
    });

    test('every fri', () => {
      expect(findRepeatOptions('every fri')).toEqual(['weekdays', ['fri']]);
    });

    test('every saturday', () => {
      expect(findRepeatOptions('every saturday')).toEqual([
        'weekdays',
        ['sat'],
      ]);
    });

    test('every sat', () => {
      expect(findRepeatOptions('every sat')).toEqual(['weekdays', ['sat']]);
    });

    test('every sunday and friday', () => {
      expect(findRepeatOptions('every sunday and friday')).toEqual([
        'weekdays',
        ['sun', 'fri'],
      ]);
    });

    test('every sun and tue', () => {
      expect(findRepeatOptions('every sun and tue')).toEqual([
        'weekdays',
        ['sun', 'tue'],
      ]);
    });

    test('every sun and tue and wednesday', () => {
      expect(findRepeatOptions('every sun and tue and wednesday')).toEqual([
        'weekdays',
        ['sun', 'tue', 'wed'],
      ]);
    });

    test('every sunday and friday and saturday', () => {
      expect(
        findRepeatOptions('every sunday and friday and saturday'),
      ).toEqual(['weekdays', ['sun', 'fri', 'sat']]);
    });

    test('every sunday friday saturday', () => {
      expect(findRepeatOptions('every sunday friday saturday')).toEqual([
        'weekdays',
        ['sun', 'fri', 'sat'],
      ]);
    });

    test('every sun fri wed', () => {
      expect(findRepeatOptions('every sun fri wed')).toEqual([
        'weekdays',
        ['sun', 'fri', 'wed'],
      ]);
    });

    test('every sun, fri, wed', () => {
      expect(findRepeatOptions('every sun, fri, wed')).toEqual([
        'weekdays',
        ['sun', 'fri', 'wed'],
      ]);
    });

    test('every sun,fri,wed', () => {
      expect(findRepeatOptions('every sun,fri,wed')).toEqual([
        'weekdays',
        ['sun', 'fri', 'wed'],
      ]);
    });
  });
});

describe('due analyzers', () => {
  describe('dates', () => {
    it('get the correct date from day month year format', () => {
      expect(
        findDueDateOptions('3rd feb 2025').isSame(
          moment('03-02-2025', 'DD-MM-YYYY'),
        ),
      ).toBeTruthy();
    });

    it('gets the correct year from two digit', () => {
      expect(
        findDueDateOptions('on 20th jan 25').isSame(
          moment('20-01-2025', 'DD-MM-YYYY'),
        ),
      ).toBeTruthy();
    });

    // dates in the format DD/MM/YYYY or similar are not very important now
    // it's better to let the user choose his date format
    // because month and day may differs from countries

    it("doesn't get old dates", () => {
      expect(findDueDateOptions('on 20th jan 1998')).toBeNull();
    });

    it("doesn't get misleading dates", () => {
      expect(findDueDateOptions('20-01-3')).toBeNull();
    });

    it('gets tomorrow', () => {
      expect(
        findDueDateOptions('tomorrow').isSame(moment().add(1, 'days'), 'day'),
      ).toBeTruthy();
    });

    it('next sunday', () => {
      const now = moment();
      const expected = now.add(1, 'days');

      while (!expected.format('dddd').toLocaleLowerCase() === 'sunday') {
        expected.add(1, 'days');
      }

      const actual = findDueDateOptions('next sunday');

      console.log(actual.format('dddd'));
      expect(actual.format('dddd').toLocaleLowerCase()).toBe('sunday');
    });

    it('wedding returns !== wednesday', () => {
      expect(findDueDateOptions('wedding')).toBeFalsy();
    });

    it('next wedding returns !== wednesday', () => {
      expect(findDueDateOptions('next wedding')).toBeFalsy();
    });

    it('next fri', () => {
      const now = moment();
      const result = now.add(1, 'days');

      while (!result.format('dddd').toLocaleLowerCase() === 'friday') {
        result.add(1, 'days');
      }

      expect(findDueDateOptions('next fri').format('dddd').toLowerCase()).toBe(
        'friday',
      );
    });

    it('next day', () => {
      const tomorrow = moment().add(1, 'days');

      expect(
        findDueDateOptions('next day').isSame(tomorrow, 'day'),
      ).toBeTruthy();
    });

    it('next week', () => {
      const nextWeek = moment().add(7, 'days');

      expect(
        findDueDateOptions('next week').isSame(nextWeek, 'day'),
      ).toBeTruthy();
    });

    it('next month', () => {
      const nextMonth = moment().add(1, 'months');

      expect(
        findDueDateOptions('next month').isSame(nextMonth, 'day'),
      ).toBeTruthy();
    });

    it('next year', () => {
      const nextYear = moment().add(1, 'years');

      expect(
        findDueDateOptions('next year').isSame(nextYear, 'day'),
      ).toBeTruthy();
    });

    it('tomorrow', () => {
      const tomorrow = moment().add(1, 'days');

      expect(
        findDueDateOptions('tomorrow').isSame(tomorrow, 'day'),
      ).toBeTruthy();
    });
  });

  describe('times', () => {
    it('2:00AM', () => {
      expect(
        findDueTimeOptions('at 2:00AM').isSame(
          moment('02:00', 'HH:mm'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('19:59', () => {
      expect(
        findDueTimeOptions('at 19:59').isSame(
          moment('19:59', 'HH:mm'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('10:00AM', () => {
      expect(
        findDueTimeOptions('at 10:00AM').isSame(
          moment('10:00', 'HH:mm'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('10:00PM', () => {
      expect(
        findDueTimeOptions('at 10:00PM').isSame(
          moment('22:00', 'HH:mm'),
          'second',
        ),
      ).toBeTruthy();
    });
  });

  describe('daytimes', () => {
    it('morning', () => {
      expect(
        findDueTimeOptions('morning').isSame(moment('08:00', 'HH:mm'), 'second'),
      ).toBeTruthy();
    });

    it('afternoon', () => {
      expect(
        findDueTimeOptions('afternoon').isSame(
          moment('13:00', 'HH:mm'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('evening', () => {
      expect(
        findDueTimeOptions('evening').isSame(moment('18:00', 'HH:mm'), 'second'),
      ).toBeTruthy();
    });

    it('night', () => {
      expect(
        findDueTimeOptions('night').isSame(moment('21:00', 'HH:mm'), 'second'),
      ).toBeTruthy();
    });

    it('next morning', () => {
      const repeatOpt = findDueTimeOptions('next morning');
      expect(repeatOpt.format('HH')).toBe('08');
    });

    it('next afternoon', () => {
      const repeatOpt = findDueTimeOptions('next afternoon');
      expect(repeatOpt.format('HH')).toBe('13');
    });

    it('next evening', () => {
      const repeatOpt = findDueTimeOptions('next evening');
      expect(repeatOpt.format('HH')).toBe('18');
    });

    it('next night', () => {
      const repeatOpt = findDueTimeOptions('next night');
      expect(repeatOpt.format('HH')).toBe('21');
    });
  });

  describe('after days/weeks/months..', () => {
    it('after 2 days', () => {
      expect(
        findDueDateOptions('after 2 days').isSame(
          moment().add(2, 'days'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('after a month', () => {
      expect(
        findDueDateOptions('after a month').isSame(
          moment().add(1, 'months'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('after one month', () => {
      expect(
        findDueDateOptions('after one month').isSame(
          moment().add(1, 'months'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('after 2 years', () => {
      const expected = moment().add(2, 'years');

      expect(
        findDueDateOptions('after 2 years').isSame(expected, 'day'),
      ).toBeTruthy();
    });

    it('after one year', () => {
      const expected = moment().add(1, 'years');

      expect(
        findDueDateOptions('next year').isSame(expected, 'day'),
      ).toBeTruthy();
    });

    it('after 1 day', () => {
      expect(
        findDueDateOptions('after 1 day').isSame(
          moment().add(1, 'day'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('after 4 weeks', () => {
      expect(
        findDueDateOptions('after 4 weeks').isSame(
          moment().add(4, 'weeks'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('after week', () => {
      expect(
        findDueDateOptions('after week').isSame(
          moment().add(1, 'weeks'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('after one week', () => {
      expect(
        findDueDateOptions('after one week').isSame(
          moment().add(1, 'weeks'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('after 1 week', () => {
      expect(
        findDueDateOptions('after 1 week').isSame(
          moment().add(1, 'weeks'),
          'second',
        ),
      ).toBeTruthy();
    });
  });

  describe('after hours/minutes..', () => {
    it('after an hour', () => {
      expect(
        findDueTimeOptions('after an hour').isSame(
          moment().add(1, 'hours'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('after 4 hours', () => {
      expect(
        findDueTimeOptions('after 4 hours').isSame(
          moment().add(4, 'hours'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('after 22 minutes', () => {
      expect(
        findDueTimeOptions('after 22 minutes').isSame(
          moment().add(22, 'minutes'),
          'second',
        ),
      ).toBeTruthy();
    });

    it('after one minute', () => {
      expect(
        findDueTimeOptions('after one minute').isSame(
          moment().add(1, 'minutes'),
          'second',
        ),
      ).toBeTruthy();
    });
  });
});
