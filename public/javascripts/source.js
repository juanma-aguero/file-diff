$("#dosubmit").click(function (e) {
    $.ajax({
        type: "POST",
        url: "/uploads/",
        data: $(this).serialize(),
        success: function (data)
        {
            alert(data);
        }
    });

    return false;
});
