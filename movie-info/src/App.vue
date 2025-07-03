<template>
  <h1>영화정보</h1>
  <div v-for="(movie, idx) in data" :key="idx" class="item">
    <figure>
      <img :src="`${movie.imgUrl}`" :alt="movie.title">
    </figure>
    <div class="info">
      <h3 class="bg-yellow" :style="textRed">{{ movie.title }}</h3>
      <p>개봉: {{ movie.year }}</p>
      <p>장르: {{ movie.category }}</p>
      <button 
        @:click="increaseLike(idx)">좋아요
      </button> 
      <span>{{ " " + movie.like }}</span>
      <p>
        <button> 상세 정보 </button>
      </p>
    </div>
  </div>

  <p>{{ foods[0] }}</p>
  <p v-for="(item, k) in foods" :key="k">{{ item }}</p>

</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        foods: ["김밥", "순대", "만두"],
        data : [
          {
            title: "노량",
            year: 2023,
            category: "액션, 드라마",
            textRed: "color: red",
            like: 0,
            imgUrl: './assets/poster1.jpg',
          },
          {
            title: "아쿠아맨과 로스트 킹덤",
            year: 2023,
            category: "액션, 판타지, 어드벤쳐",
            like: 0,
            imgUrl: './assets/poster2.jpg',
          },
          {
            title: "3일의 휴가",
            year: 2023,
            category: "판타지, 드라마",
            like: 0,
            imgUrl: './assets/poster3.jpg',
          }
        ],
      }
    },
    methods: {
      increaseLike(idx) {
        this.data[idx].like += 1;
      }
    }
  }

</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
  }

  body {
    max-width: 768px;
    margin: 0 auto;
    padding: 20px;
  }

  h1, h2, h3 {
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 0.5rem;
  }

  button {
    margin-right: 10px;
    margin-top: 1rema;
  }

  .item {
    width: 100%;
    border: 1px solid #ccc;
    display: flex;
    margin-bottom: 20px;
    padding: 1rem;
  }

  .item figure {
    width: 30%;
    margin-right: 1rem;
  }

  .item img {
    width: 100%
  }

  .item.info {
    width: 100%;
  }


  .bg-yellow {
    background: gold;
    padding: 10px;
  }
</style>
