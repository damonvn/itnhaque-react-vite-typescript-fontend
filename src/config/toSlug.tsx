const toSlug = (str: string) => {
    // Loại bỏ dấu tiếng Việt
    const from = "àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ";
    const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";
    const regex = new RegExp(from.split('').join('|'), 'g');
    str = str.replace(regex, char => to.charAt(from.indexOf(char)));

    // Chuyển về chữ thường, thay khoảng trắng và ký tự đặc biệt thành dấu gạch ngang
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')  // Loại bỏ ký tự không hợp lệ
        .trim()                        // Loại bỏ khoảng trắng ở đầu và cuối
        .replace(/\s+/g, '-');         // Thay khoảng trắng bằng dấu gạch ngang
}

export default toSlug;