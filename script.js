;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  let page = 1;
  const limit = 10;
  const $posts = get('.posts');
  const end = 100;
  let total = 10;
  let timer = 0;

  const $loader = get(".loader");

  const getPost = async () => {
    const API_URL = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`;
    const reponse = await fetch(API_URL);
    if (!reponse.ok) {
      throw new Error('에러');
    }
    return await reponse.json();
  }

  const showPosts = (posts) => {
    posts.forEach((post) => {
      const $post = document.createElement('div');
      $post.classList.add('post');
      $post.innerHTML = `
      <div class="header">
        <div class="id">${post.id}</div>
        <div class="title">${post.title}</div>
      </div>
      <div class="body">${post.body}</div>`;
      $posts.appendChild($post);
    })
  }

  const loadPost = async () => {
    showLoader();
    try {
      const response = await getPost();
      showPosts(response);
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  }

  const showLoader = () => {
    $loader.classList.add('show');
  }

  const hideLoader = () => {
    $loader.classList.remove('show');
  }

  const onScroll =  () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (total === end) {
      window.removeEventListener('scroll', onScroll);
      return;
    }
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      page++;
      total += 10;
      loadPost();
      return;
    }
  }

  const throttle = (callback, time) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
    }, time)
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadPost();
    window.addEventListener('scroll', () => throttle(onScroll, 50));
  })
})()
