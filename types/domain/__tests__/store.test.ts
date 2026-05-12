import { describe, expect, it } from 'vitest';

import type { MyStoresResponseDto, StoreDto } from '@/types/api/store';
import { PlatformType, StoreStatus } from '@/types/enums';

import { toMyStoresResult, toStoreDomain } from '../store';

describe('toStoreDomain', () => {
  it('StoreDto 필드를 그대로 매핑한다', () => {
    const dto: StoreDto = {
      id: 1,
      name: '쇼핑몰A',
      url: 'https://smartstore.naver.com/a',
      platform: 'naver',
      platformType: PlatformType.SMARTSTORE,
      status: StoreStatus.ACTIVE,
    };

    expect(toStoreDomain(dto)).toEqual(dto);
  });
});

describe('toMyStoresResult', () => {
  const baseDto: MyStoresResponseDto = {
    storeQuota: {
      max: 5,
      registered: 3,
      used: 3,
      remaining: 2,
    },
    stores: [
      {
        id: 1,
        name: 'A',
        url: 'https://smartstore.naver.com/a',
        platform: 'naver',
        platformType: PlatformType.SMARTSTORE,
        status: StoreStatus.ACTIVE,
      },
      {
        id: 2,
        name: 'B',
        url: 'https://smartstore.naver.com/b',
        platform: 'naver',
        platformType: PlatformType.SMARTSTORE,
        status: StoreStatus.PENDING,
      },
    ],
  };

  it('storeQuota 4개 필드(max/registered/used/remaining)를 그대로 옮긴다', () => {
    const result = toMyStoresResult(baseDto);

    expect(result.storeQuota).toEqual({
      max: 5,
      registered: 3,
      used: 3,
      remaining: 2,
    });
  });

  it('stores 배열을 toStoreDomain 으로 매핑한다', () => {
    const result = toMyStoresResult(baseDto);

    expect(result.stores).toHaveLength(2);
    expect(result.stores[0]).toEqual(baseDto.stores[0]);
    expect(result.stores[1]).toEqual(baseDto.stores[1]);
  });

  it('used 와 registered 가 다른 경우(추후 INACTIVE 포함 케이스)도 그대로 반영한다', () => {
    const dto: MyStoresResponseDto = {
      ...baseDto,
      storeQuota: {
        max: 5,
        registered: 3,
        used: 4, // INACTIVE 1개 포함된 가상 케이스
        remaining: 1,
      },
    };

    const result = toMyStoresResult(dto);

    expect(result.storeQuota.registered).toBe(3);
    expect(result.storeQuota.used).toBe(4);
    expect(result.storeQuota.remaining).toBe(1);
  });

  it('한도 초과 케이스(used > max)도 음수 없이 그대로 전달한다', () => {
    const dto: MyStoresResponseDto = {
      ...baseDto,
      storeQuota: {
        max: 2,
        registered: 4,
        used: 4,
        remaining: 0, // 백엔드가 0으로 clamp 한다고 가정
      },
    };

    const result = toMyStoresResult(dto);

    expect(result.storeQuota.max).toBe(2);
    expect(result.storeQuota.used).toBe(4);
    expect(result.storeQuota.remaining).toBe(0);
  });

  it('visible stores 가 비어도 storeQuota.registered 와 무관하게 동작한다', () => {
    const dto: MyStoresResponseDto = {
      storeQuota: { max: 5, registered: 2, used: 2, remaining: 3 },
      stores: [], // INACTIVE/UNLINKED/DELETED 만 있는 가상 케이스
    };

    const result = toMyStoresResult(dto);

    expect(result.stores).toEqual([]);
    expect(result.storeQuota.registered).toBe(2);
  });
});
