import pytest
import datetime
import time
import asyncio
from cachetools import TTLCache
from freezegun import freeze_time

from app.utils.async_cache import cached


@pytest.mark.asyncio
async def test_cached_function_result_is_stored():
    cache = {}
    calls = 0

    @cached(cache)
    async def service(value):
        nonlocal calls
        calls += 1
        return f"result: {value}"

    result = await service("test")

    assert result == "result: test"
    assert calls == 1
    assert len(cache) == 1


@pytest.mark.asyncio
async def test_cached_function_returns_cached_result():
    cache = {}
    calls = 0

    @cached(cache)
    async def service(value):
        nonlocal calls
        calls += 1
        return f"result: {value}"

    result_1 = await service("test")
    result_2 = await service("test")

    assert result_1 == "result: test" == result_2
    assert calls == 1
    assert len(cache) == 1


@pytest.mark.asyncio
async def test_cached_function_executes_on_cache_miss():
    cache = {}
    calls = 0

    @cached(cache)
    async def service(value):
        nonlocal calls
        calls += 1
        return f"result: {value}"

    result_1 = await service("test_1")
    result_2 = await service("test_2")

    assert result_1 == "result: test_1"
    assert result_2 == "result: test_2"
    assert calls == 2
    assert len(cache) == 2


@pytest.mark.asyncio
async def test_cached_function_executes_after_ttl_expiration():
    calls = 0

    initial_datetime = datetime.datetime(
        year=2026, month=9, day=14, hour=12, minute=15, second=30)

    with freeze_time(initial_datetime) as frozen_datetime:
        # timer function but must be declared inside of the freeze_time context
        # 'time.monotonic' is the default timer function of cachetools.TTLCache
        cache = TTLCache(maxsize=10, ttl=60, timer=time.monotonic)

        @cached(cache)
        async def service(value):
            nonlocal calls
            calls += 1
            return f"result: {value}"

        assert frozen_datetime() == initial_datetime
        result_1 = await service("test")

        frozen_datetime.tick(delta=datetime.timedelta(minutes=2, seconds=1))
        assert frozen_datetime() == initial_datetime + \
            datetime.timedelta(minutes=2, seconds=1)

        expired = cache.expire()
        assert expired == [(('test',), 'result: test')]

        result_2 = await service("test")

    assert result_1 == "result: test" == result_2
    assert calls == 2
    assert len(cache) == 1


@pytest.mark.asyncio
async def test_cached_function_does_not_cache_exceptions():
    cache = {}
    calls = 0
    service_error = True

    @cached(cache)
    async def service(value):
        nonlocal calls
        calls += 1
        nonlocal service_error
        if service_error:
            raise Exception("service produced an error")
        return f"result: {value}"

    with pytest.raises(Exception, match="service produced an error"):
        await service("test")

    assert calls == 1
    assert len(cache) == 0

    service_error = False
    result = await service("test")
    assert result == "result: test"
    assert calls == 2
    assert len(cache) == 1


@pytest.mark.asyncio
async def test_concurrent_calls_share_result():
    cache = {}
    calls = 0

    @cached(cache)
    async def service(value):
        nonlocal calls
        calls += 1
        await asyncio.sleep(0.05)
        return f"result: {value}"

    results = await asyncio.gather(*[service("test") for _ in range(10)])

    assert all([r == "result: test" for r in results])
    assert calls == 1
    assert len(cache) == 1


@pytest.mark.asyncio
async def test_function_preserves_metadata():
    @cached({})
    async def service():
        ...

    assert service.__name__ == "service"
