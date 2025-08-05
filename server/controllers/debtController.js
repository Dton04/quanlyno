const User = require('../models/User');
const Debt = require('../models/Debt');

// Thêm người dùng và nợ mới
const addUserAndDebt = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !email ) {
      return res.status(400).json({ message: 'Tên, email là bắt buộc' });
    }

    // Kiểm tra xem người dùng đã tồn tại chưa (dựa trên email)
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
    }

    // Tạo người dùng mới
    user = new User({ name, email, phone, totalDebt: 0 }); 
    await user.save();
    
    // Trả về thông tin người dùng mới
    res.status(201).json({ 
      message: 'Thêm người nợ thành công',
      user 
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

// Thêm nợ mới
const addDebt = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    const debt = new Debt({ 
      userId, 
      amount, 
      description,
      createdAt: new Date(),
      status: 'pending'
    });
    await debt.save();

    // Cập nhật tổng nợ của user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Người dùng không tìm thấy' });
    user.totalDebt += amount;
    await user.save();

    res.status(201).json(debt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách nợ
const getDebts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search
      ? {
          $or: [
            { description: new RegExp(search, 'i') },
          ],
        }
      : {};

    const debts = await Debt.find(query)
      .populate('userId', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    // Lọc thêm theo tên người dùng nếu có từ khóa tìm kiếm
    const filteredDebts = search
      ? debts.filter((debt) =>
          debt.userId?.name.toLowerCase().includes(search.toLowerCase())
        )
      : debts;

    const total = await Debt.countDocuments(query);
    res.json({
      debts: filteredDebts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xử lý thanh toán nợ
const makePayment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Số tiền thanh toán không hợp lệ' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Tạo một khoản nợ mới với số tiền âm (thanh toán)
    const payment = new Debt({
      userId,
      amount: -amount,
      description: 'Thanh toán nợ',
      status: 'paid',
      date: new Date()
    });
    await payment.save();

    // Cập nhật tổng nợ của người dùng
    user.totalDebt -= amount;
    await user.save();

    res.status(200).json({ 
      message: 'Thanh toán thành công',
      payment,
      newTotalDebt: user.totalDebt
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

// Cập nhật trạng thái nợ (thanh toán)
const updateDebt = async (req, res) => {
  try {
    const { debtId, status } = req.body;
    const debt = await Debt.findById(debtId);
    if (!debt) return res.status(404).json({ message: 'Khoản nợ không tìm thấy' });

    debt.status = status;
    await debt.save();

    if (status === 'paid') {
      const user = await User.findById(debt.userId);
      if (!user) return res.status(404).json({ message: 'Người dùng không tìm thấy' });
      user.totalDebt -= debt.amount;
      await user.save();
    }

    res.json(debt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email phone totalDebt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserDebts = async (req, res) => {
  try {
    const { userId } = req.params;
    const debts = await Debt.find({ userId })
      .populate('userId', 'name email phone')
      .sort({ date: -1 })
      .lean(); // Chuyển về plain JavaScript object

    // Thêm định dạng ngày trước khi gửi về client
    const debtsWithFormattedDate = debts.map(debt => {
      const date = new Date(debt.date);
      const formattedDate = date instanceof Date && !isNaN(date) 
        ? date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'Không có ngày';
      return {
        ...debt,
        formattedDate
      };
    });

    res.json({ debts: debtsWithFormattedDate });
  } catch (error) {
    console.error('Error fetching user debts:', error);
    res.status(500).json({ message: 'Lỗi khi tải danh sách khoản nợ' });
  }
};

module.exports = {
  addUserAndDebt,
  addDebt,
  getDebts,
  updateDebt,
  getUsers,
  getUserDebts,
  makePayment,
};