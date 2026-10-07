"""
Utilities for caching the results of asynchronous functions.

This module provides an async-compatible caching decorator built on top of 
``cachetools``. Unlike ``cachetools.cached``, which caches the coroutine 
object returned by an async function, this decorator awaits the function 
before storing its result.

As a consequence, only successfully completed results are added to the cache. 
If the wrapped function raises an exception, the result is not 
cached and the exception is propagated to the caller.
"""

import asyncio
import cachetools
import functools
from cachetools.keys import hashkey
from typing import Any


_MISSING = object()


def cached(cache: cachetools.Cache):
    """
    Cache the results of an asynchronous function.

    The cache key is generated from the wrapped function's positional and
    keyword arguments using ``cachetools.keys.hashkey``. On a cache hit,
    the cached result is returned immediately without executing the wrapped
    function.

    On a cache miss, the wrapped function is awaited first. Its result is
    stored in the cache only after the operation completes successfully.
    If the function raises an exception, nothing is added to the cache and
    the exception is propagated unchanged.

    Args:
        cache: The cache instance used to store the function results. Any
            ``cachetools.Cache`` implementation can be used.

    Returns:
        A decorator that can be applied to an asynchronous function.

    Example:
        >>> cache = cachetools.TTLCache(maxsize=100, ttl=60)
        >>>
        >>> @cached(cache)
        >>> async def fetch_data(query: str):
        ...     ...
    """

    locks: dict[Any, asyncio.Lock] = {}

    def decorator(func):
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            key = hashkey(*args, **kwargs)
            cached_value = cache.get(key, _MISSING)
            if cached_value is not _MISSING:
                return cached_value

            lock = locks.setdefault(key, asyncio.Lock())
            async with lock:
                cached_value = cache.get(key, _MISSING)
                if cached_value is not _MISSING:
                    return cached_value

                try:
                    result = await func(*args, **kwargs)
                    cache[key] = result
                    return result
                finally:
                    locks.pop(key, None)

        return async_wrapper
    return decorator
