$(function() {
    $.get('/v1/creators', function(data){
        const $tbody = $("#creatorTable").find('tbody');
        $.each(data, function (index, row) {
            const date = new Date(row.dailyRecord.date);
            $tbody.append(`<tr>
                <td>${row.key}</td>
                <td>${row.name}</td>
                <td class="td-total-issues" data-key="${row.key}">${row.totalIssues}</td>
                <td>
                    ${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}
                    (Issues: ${row.dailyRecord.issues})
                </td>
            </tr>`);
        })

        $(".td-total-issues").on('dblclick', function(e){
            const val = $(this).text();
            const key = $(this).data('key');
            $(this).html(`<div class="input-group">
                <input class="form-control form-control-sm" type="number" value="${val}">
                <button class="btn btn-success btn-sm btn-save-issues" type="button" data-key="${key}">✓</button>
            </div>`);

            const $td = $(this);

            $td.find(".btn-save-issues").on('click', function(e) {
                const key = $(this).data('key');
                const issues = parseInt($(this).siblings('input[type=number]').val());
                const $btn = $(this);
                $btn.attr('disabled', true);

                $.ajax({
                    url: `/v1/creators/${key}`,
                    method: 'PATCH',
                    data: {
                        issues
                    },
                    success: function() {
                        $btn.off('click');
                        $td.text(issues);
                    },
                    error: function(xhr){
                        alert(`HTTP ${xhr.status} \n ${xhr.responseText}`);
                        $btn.attr('disabled', false);
                    }
                });
            })
        })
    });
});