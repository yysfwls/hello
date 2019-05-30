$(function () {
    /**
    function Dog() {
        return new Dog.prototype.init();
    }

    Dog.prototype = {
        constructor: Dog,
        init: function () {
            this.name = "we";
            this.age = 1;
        },
        say: function () {
            console.log(this.name, this.age);
        }
    };
    Dog.prototype.init.prototype = Dog.prototype;
    var d = new Dog();
    d.say();
     **/

    $(function () {
        //0滚动条插件
        $(".content_list").mCustomScrollbar();

        var $audio = $("audio");
        var player = new Player($audio);
        var progress;
        var voiceProgress;
        var lyric;

        //1加载歌曲列表
        getPlayerList();
        function getPlayerList() {
            $.ajax({
                url: "./source/musiclist.json",
                dataType: "json",
                success: function (data) {
                    player.musicList = data;
                    // 3.1遍历获取到的数据, 创建每一条音乐
                    var $musicList = $(".content_list ul");
                    $.each(data, function (index, ele) {
                        var $item = crateMusicItem(index, ele);
                        $musicList.append($item);
                    });
                    initMusicInfo(data[0]);
                    initMusicLyric(data[0]); //初始化默认歌词
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }

        //2初始化歌曲信息
        function initMusicInfo(music) {
            var $musicImage = $(".song_info_pic img");
            var $musicName = $(".song_info_name a");
            var $musicSinger = $(".song_info_singer a");
            var $musicAblum = $(".song_info_ablum a")
            var $musicProgressName = $(".music_progress_name");
            var $musicProgressTime = $(".music_progress_time");
            var $musicBg = $(".mask_bg");




            //给获取到的元素赋值
            $musicImage.attr("src", music.cover);
            $musicName.text(music.name);
            $musicSinger.text(music.singer);
            $musicAblum.text(music.ablum);
            $musicProgressName.text(music.name + " / " + music.singer);
            $musicProgressTime.text("00:00 / " + music.time);
            $musicBg.css("background", "url('" + music.cover + "')");
        }

        // 3.初始化歌词信息
        function initMusicLyric(music){
            lyric = new Lyric(music.link_lrc);
            lyric.loadLyric();

            var $lryicContainer = $(".song_lyric");
            // 清空上一首音乐的歌词
            $lryicContainer.html("");
            lyric.loadLyric(function () {
                // 创建歌词列表
                $.each(lyric.lyrics, function (index, ele) {
                    var $item = $("<li>"+ele+"</li>");
                    $lryicContainer.append($item);
                });
            });
        }

        //3初始化进度条
        initProgress();
        function initProgress() {
            var $progressBar = $(".music_progress_bar");
            var $progressLine = $(".music_progress_line");
            var $progressDot = $(".music_progress_dot");
            progress = Progress($progressBar, $progressLine, $progressDot);
            progress.progressClick(function (value) {
                player.musicSeekTo(value);
            });
            progress.progressMove(function (value) {
                player.musicSeekTo(value);
            });

            var $voiceBar = $(".music_voice_bar");
            var $voiceLine = $(".music_voice_line");
            var $voiceDot = $(".music_voice_dot");
            voiceProgress = Progress($voiceBar, $voiceLine, $voiceDot);
            voiceProgress.progressClick(function (value) {
                player.musicVoiceSeekTo(value);
            });
            voiceProgress.progressMove(function (value) {
                player.musicVoiceSeekTo(value);
            });
        }

        //4初始化事件监听；
        initEvents();
        function initEvents() {
            //1监听歌曲的移入移除
            $(".content_list").delegate(".list_music", "mouseenter", function () {
                //显示子菜单
                $(this).find(".list_menu").stop().fadeIn(100);
                $(this).find(".list_time a").stop().fadeIn(100);
                //隐藏时长
                $(this).find(".list_time span").stop().fadeOut(100);
            });
            $(".content_list").delegate(".list_music", "mouseleave", function () {
                //隐藏子菜单
                $(this).find(".list_menu").stop().fadeOut(100);
                $(this).find(".list_time a").stop().fadeOut(100);
                //显示时长
                $(this).find(".list_time span").stop().fadeIn(100);
            });


            // 2.监听复选框的点击事件
            //.delegate方法：当点击鼠标时，隐藏或显示 当前 元素：
            //.toggleClass对设置和移除所有 当前 元素的 "list_checked" 类进行切换：

            $(".content_list").delegate(".list_check", "click", function () {
                $(this).toggleClass("list_checked");
            });
                //顶部删除歌曲
                $('.delete').click(function () {
                    if ($(".list_check").hasClass("list_checked")){
                        $('.list_checked').parent().remove();
                        let index = 1;
                        $('.list_check').parent().each(function () {
                            if ($(this).find('.list_name').text() !== '歌曲'){
                                $(this).find('.list_number').text(index);
                                index += 1;
                            }
                        })
                    } else {
                        alert("请选择操作的歌单");
                    }
                });
                //顶部下载
                $(".download").click(function () {
                     if ($(".list_check").hasClass("list_checked")){
                        alert("下载到本地我还不会..");
                    } else {
                        alert("请选择操作的歌单");
                    }
                });
                //顶部切换红心
                //bug切换歌曲红心不会消除啊啊啊
                $(".redheart").click(function () {
                    if ($(".list_check").hasClass("list_checked")){
                        $(".music_fav").addClass("music_fav_like");
                    } else {
                        alert("请选择操作的歌单");
                    }
                });

            //切换红心
            $(".footer_in").delegate(".music_fav", "click", function () {
                $(this).toggleClass("music_fav_like");
            });

            //切换纯净模式 我没写完
            $(".footer_in").delegate(".music_only", "click", function () {
                $(this).toggleClass("music_only_on");
            });
            $(".music_only").click(function () {
                if ($(".music_only").hasClass("music_only_on")){
                    $(".content_in").css("display","block");
                } else{
                    $(".content_in").css("display","none");

                }
            });
            //3添加了子菜单播放按钮的监听
            let $musicPlay = $(".music_play");
            $(".content_list").delegate(".list_menu_play", "click", function () {

                var $item = $(this).parents(".list_music");
                // console.log($item.get(0).index);
                // console.log($item.get(0).music);

                //3.1切换播放图标
                $(this).toggleClass("list_menu_play2");

                //3.2复原其他播放图标
                $item.siblings().find(".list_menu_play")
                    .removeClass("list_menu_play2");

                //3.3同步底部播放按钮
                if ($(this).attr("class").indexOf("list_menu_play2") != -1) {
                    //当子菜单的播放按钮是播放状态
                    $musicPlay.addClass("music_play2");
                    //文字高亮
                    $item.find("div").css("color", "#fff");
                    $item.siblings().find("div").css("color", "rgba(255,255,255,0.5)");
                } else {
                    //当子菜单的播放按钮是暂停状态
                    $musicPlay.removeClass("music_play2");
                    //让文字不高亮
                    $item.find("div").css("color", "rgba(255,255,255,0.5)");
                }
                //3.4切换序号状态
                $item.find(".list_number").toggleClass("list_number2");
                $item.siblings().find(".list_number").removeClass("list_number2");

                //3.5播放音乐
                player.playMusic($item.get(0).index, $item.get(0).music);

                //3.6切换歌曲信息
                initMusicInfo($item.get(0).music);
                initMusicLyric($item.get(0).music);
            });

            //4监听底部控制区播放按钮的点击
            $musicPlay.click(function () {
                //判断有没有播放过音乐
                if (player.currentIndex == -1) {
                    $(".list_music").eq(0).find(".list_menu_play").trigger("click");

                } else {
                    $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
                }

            });
            //5底部上一首
            $(".music_pre").click(function () {
                $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");

            });
            //6底部下一首
            $(".music_next").click(function () {
                $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");

            });
            //7删除
            $(".content_list").delegate(".list_menu_del", "click", function () {
                //找到被点击的音乐
                var $item = $(this).parents(".list_music");
                $item.remove();
                player.changeMusic($item.get(0).index);

                //重新排序
                $(".list_music").each(function (index, ele) {
                    ele.index = index;
                    $(ele).find(".list_number").text(index + 1);
                });
            });
            //8播放监听的进度
            player.musicTimeUpdate(function (currentTime, duration, timeStr) {
                //同步时间
                $(".music_progress_time").text(timeStr);
                //同步进度条
                //计算播放比例
                var value = currentTime / duration * 100;
                progress.setProgress(value);

                //实现歌词同步
                var index = lyric.currentIndex(currentTime);
                var $item = $(".song_lyric li").eq(index);
                $item.addClass("cur");
                $item.siblings().removeClass("cur");

                if (index <= 2) return;

                $(".song_lyric").css({
                    marginTop:(-index + 2) * 30
                });
            });



        //监听声音按钮的点击
        $(".music_voice_icon").click(function () {
            $(this).toggleClass("music_voice_icon2");//图标切换
            if ($(this).attr("class").indexOf("music_voice_icon2") !=-1){
                player.musicVoiceSeekTo(0);
            } else{
                player.musicVoiceSeekTo(1);
            }
        });

    };
        //定义一个方法创建一条音乐
        function crateMusicItem(index, music) {
            var $item = $("" +
                "<li class=\"list_music\">\n" +
                "<div class=\"list_check\"><i></i></div>\n" +
                "<div class=\"list_number \">" + (index + 1) + "</div>\n" +
                "<div class=\"list_name\">" + music.name + "" +
                "<div class=\"list_menu\">\n" +
                "<a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
                "<a href=\"javascript:;\" title=\"添加\"></a>\n" +
                "<a href=\"javascript:;\" title=\"下载\"></a>\n" +
                "<a href=\"javascript:;\" title=\"分享\"></a>\n" +
                "</div>\n" +
                "</div>\n" +
                "<div class=\"list_singer\">" + music.singer + "</div>\n" +
                "<div class=\"list_time\">\n" +
                "<span>" + music.time + "</span>\n" +
                "<a href=\"javascript:;\" title=\"删除\" " +
                "class='list_menu_del'></a>\n" +
                "</div>\n" +
                "</li>");
            $item.get(0).index = index;
            $item.get(0).music = music;
            return $item;
        }
    });
});
