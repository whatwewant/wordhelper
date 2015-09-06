/* Main Js */
/****************************************************
 > File Name    : main.js
 > Author       : Cole Smith
 > Mail         : tobewhatwewant@gmail.com
 > Github       : whatwewant
 > Created Time : 2015年09月02日 星期三 11时51分40秒
 ****************************************************/

    var WordHelper = {
        popover_id: "#wordhelper_popover",
        popover_id_name: "wordhelper_popover",

        // get Offset depends on its direction
        getOffset: function(dir, e) {
                var offset = 0;
                switch (dir.toLowerCase()) {
                    case 'left':
                        offset = e.offsetLeft;
                        break;
                    case 'top':
                        offset = e.offsetTop;
                        break;
                } 

                if (! e.offsetParent)
                    return offset;
                return (offset + this.getOffset(dir, e.offsetParent));
            },

        setPopoverPosition: function (left, top) {
                $(wordhelper_popover).css({
                    position: 'absolute',
                    left: left,
                    top: top
                });
            },

        getSelectionOffset: function (callback) {
                var left = window.innerWidth / 2;
                var top = window.innerHeight / 2;
                var selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    var range = selection.getRangeAt(0);
                    var dummy = document.createElement('span');
                    range.insertNode(dummy);
                    left = this.getOffset('left', dummy) - 50 - dummy.offsetLeft + $(dummy).position().left;
                    top = this.getOffset('top', dummy) + 25 - dummy.offsetTop + $(dummy).position().top;
                    dummy.remove();
                    window.getSelection().addRange(range);
                }
                // console.log(left + ':' + top);
                callback(left, top);
            },
        hidePopover: function () {
                $(this.popover_id).remove();
            },
        playAudio: function (audio_url) {
                if (audio_url) {
                    new Howl({
                        urls: [audio_url]
                    }).play(); 
                } 
            }, 
        popover: function (allData) {
                var data = allData.wordhelper;
                var webster = allData.webster;
                var defs = "";
                var html = '<div id=' + 
                    this.popover_id_name + 
                    '><div class="popover-inner"><h3 class="popover-title">';
                // loading notification
                if (true === data.loading) {
                    html += '<p><span class="word">' +
                        data.msg +
                        '</span></p>';
                } else {
                    if (1 == data.status_code || ! data.data) { // word doesnot exist
                        if (undefined === webster || webster.term === "") {
                            html += '未找到单词</h3></div>';
                        }
                        else {
                            html += '<p><span class="word">' +
                                webster.term +
                                '</span></p></h3>' +
                                '<div class="popover-content"><p>' +
                                webster.defs +
                                '</p></div>';
                        }
                    } else { // word exists, but no recording
                        html += '<p><span class="word">' + data.data.content +
                            '</span><small class="pronunciation">' +
                            (data.data.pron ? '['+data.data.pron+']' : '') +
                            '</small></p>';
                        if (window.location.protocol.indexOf('https') < 0) {
                            html += '<a href="#" class="speak uk">UK<i class="icon icon-speak"></i></a>' +
                                '<a href="#" class="speak us">US<i class="icon icon-speak"></i></a></h3>';
                        }
                        else {
                            html += '</h3>';
                        }
 
                        html += '<div class="popover-content">' +
                            '  <p>' + data.data.definition.split('\n').join("<br />") + "<br />" + defs + '</p>' + 
                            // '  <div class="add-btn"><a href="#" class="btn" id="wordhelper-add-btn">添加生词</a>' +
                            // '    <p class="success hide">成功添加!</p>' +
                            // '    <a href="#" target="_blank" class="btn hide"> id="wordhelper-check-btn">查看</a>' +
                            // '  </div>' +
                            '</div>';  
                    }
                }

                html += '</div></div>';
                $(this.popover_id).remove();
                $('body').append(html);

                this.getSelectionOffset(function (left, top) {
                    this.setPopoverPosition(left, top);
                }.bind(this)); 

                $(this.popover_id + ' .speak.us').click (function (e) {
                    e.preventDefault();
                    var audio_url = 'http://media.shanbay.com/audio/us/' + data.data.content + '.mp3';
                    this.playAudio(audio_url);
                }.bind(this));

                $(this.popover_id + ' .speak.uk').click (function (e) {
                    e.preventDefault();
                    var audio_url = 'http://media.shanbay.com/audio/uk/' + data.data.content + '.mp3';
                    this.playAudio(audio_url);
                }.bind(this));

                $('html').click(function () {
                    this.hidePopover();
                }.bind(this));

                $('body').on('click', this.popover_id, function (e) {
                    // e.stopPropagation();
                });
            }
    };

;(function ($) {
    $(document).ready(function () {
        $(document).on("dblclick", function () {
            var selection = document.getSelection();
            var selectedData = selection.getRangeAt(0).toString();
            if (! selectedData || ! (new RegExp(/^[a-z]+$/i).test(selectedData))) {
                return ;
            }
            selectedData = selectedData.toLowerCase();
            WordHelper.popover({
                wordhelper: {
                    loading: true,
                    msg: '正在查询...',
                }
            });
            $.ajax({
                url: "http://shanbay.com/api/v1/bdc/search/?word=" + selectedData + "&_="+ (new Date()).getTime(),
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    WordHelper.popover({
                        wordhelper: {
                            loading: false,
                            data: data.data,
                            status_code: data.status_code,
                            msg: data.msg
                        }
                    });
                }.bind(selection),
                error: function (msg) {
                    console.log("Word Helper Search Error " + msg.toString()); 
                }
            });
        });
    });
})($);
